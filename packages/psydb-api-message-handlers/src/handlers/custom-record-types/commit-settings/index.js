'use strict';
var debug = require('debug')('psydb:api:message-handlers');
var sift = require('sift');
var omit = require('@cdxoo/omit');

var { without, keyBy } = require('@mpieva/psydb-core-utils');
var { gatherDisplayFieldData } = require('@mpieva/psydb-common-lib');
var { ApiError } = require('@mpieva/psydb-api-lib');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var { SimpleHandler } = require('../../../lib');
var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'custom-record-types/commit-settings',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    cache,
    message,
}) => {
    if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }

    var {
        id,
        lastKnownEventId,
    } = message.payload;

    var existing = await (
        db.collection('customRecordType').find({
            _id: id
        }).toArray()
    );

    if (existing.length < 1) {
        throw new ApiError(404, 'CustomRecordTypeNotFound');
    }

    var record = await (
        db.collection('customRecordType')
        .findOne({ _id: id })
    );

    cache.record = record;

    // TODO: check if record label definition is still valid
    // TODO: maybe check if every field that is included
    // in the currently fixed settings is equal to the field
    // in next Settings .... on the other hand that shouldnt happen
    // in the first place we should prevent that
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,

    dispatch,
}) => {
    var { personnelId, payload } = message;
    var { id, lastKnownEventId, props } = payload;
    var { record } = cache;
    var { collection, state } = record;
    var { nextSettings, isDirty } = state;

    // do nothing if record is not dirty
    if (!isDirty) {
        return;
    }

    var collectionCreatorData = allSchemaCreators[collection];
    if (!collectionCreatorData) {
        throw new Error(inline`
            no creator data found for collection
            "${record.collection}"
        `);
    }

    await maybeRestoreHelperSets({
        db, dispatch,
        hasSubChannels, nextSettings,
    });

    //console.dir(record, { depth: null })
    var { hasSubChannels } = collectionCreatorData;
    await dispatch({
        collection: 'customRecordType',
        channelId: id,
        payload: { $set: {
            ...createCopyOps({ hasSubChannels, nextSettings }),
            ...createFormOrderOps({ hasSubChannels, record }),
            ...createCleanupOps({ hasSubChannels }),
        }}
    });
}

var maybeRestoreHelperSets = async (bag) => {
    var { db, dispatch, hasSubChannels, nextSettings } = bag;
    var helperSetIds = [];
    var fieldFilter = sift({
        type: { $in: ['HelperSetItemId', 'HelperSetItemIdList'] },
        isDirty: true,
        isRemoved: false
    })

    if (hasSubChannels) {
        var copy = {};
        ['gdpr', 'scientific'].forEach(key => {
            var fields = nextSettings.subChannelFields[key].filter(
                fieldFilter
            );
            helperSetIds.push(...fields.map(it => it.props.setId));
        });
    }
    else {
        var fields = nextSettings.fields.filter(fieldFilter);
        helperSetIds.push(...fields.map(it => it.props.setId));
    }

    var todoHelperSets = await (
        db.collection('helperSet').find({
            '_id': { $in: helperSetIds },
            'state.internals.isRemoved': true
        }, { project: { _id: true }}).toArray()
    );

    for (var it of todoHelperSets) {
        dispatch({
            collection: 'helperSet',
            channelId: it._id,
            payload: { $set: {
                'state.internals.isRemoved': false
            }}
        })
    }

}

var createCopyOps = ({ hasSubChannels, nextSettings }) => {
    var ops;

    if (hasSubChannels) {
        var copy = {};
        ['gdpr', 'scientific'].forEach(key => {
            copy[key] = (
                nextSettings.subChannelFields[key].map(it => (
                    omit([ 'isNew', 'isDirty'], it)
                ))
            );
        });

        ops = { 'state.settings.subChannelFields': copy }
    }
    else {
        var copy = nextSettings.fields.map(it => (
            omit([ 'isNew', 'isDirty'], it)
        ));
        ops = { 'state.settings.fields': copy }
    }

    return ops;
}

var createFormOrderOps = ({ hasSubChannels, record }) => {
    var { formOrder = [] } = record.state;

    var availableDisplayFieldData = gatherDisplayFieldData({
        customRecordTypeData: {
            ...record,
            state: { ...record.state, settings: record.state.nextSettings }
        }
    });
    var fieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer', // FIXME
    });

    var allPointers = (
        availableDisplayFieldData
        .filter(it => (
            it.dataPointer !== '/_id' &&
            !it.isRemoved
        ))
        .map(it => it.dataPointer) // FIXME
    );

    var newPointers = without(allPointers, formOrder);
    var removedPointers = without(formOrder, allPointers);

    var formOrderPointers = [
        ...without(formOrder, removedPointers),
        ...newPointers,
    ];

    /*var formOrder = formOrderPointers.map(pointer => {
        var field = fieldDataByPointer[pointer];
        return {
            systemType: field.systemType,
            dataPointer: field.dataPointer
        }
    })*/

    var ops = {
        'state.formOrder': formOrderPointers
    };
    //console.log({ allPointers, newPointers, removedPointers, ops });
    return ops;
}

var createCleanupOps = ({ hasSubChannels }) => {
    var ops = {
        'state.isNew': false,
        'state.isDirty': false,
    };

    if (hasSubChannels) {
        var prefix = 'state.nextSettings.subChannelFields';
        ops = {
            ...ops,
            [`${prefix}.gdpr.$[].isNew`]: false,
            [`${prefix}.gdpr.$[].isDirty`]: false,
            [`${prefix}.scientific.$[].isNew`]: false,
            [`${prefix}.scientific.$[].isDirty`]: false,
        }
    }
    else {
        var prefix = 'state.nextSettings';
        ops = {
            ...ops,
            [`${prefix}.fields.$[].isNew`]: false,
            [`${prefix}.fields.$[].isDirty`]: false,
        }
    }

    return ops;
}

module.exports = handler;
