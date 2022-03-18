'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var omit = require('@cdxoo/omit'),
    createClone = require('copy-anything').copy,
    createDiff = require('deep-diff');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var createRohrpostMessagesFromDiff = require('@mpieva/psydb-api-lib/src/diff-to-rohrpost');

var SimpleHandler = require('../../../lib/simple-handler');

var createSchema = require('./schema'),
    allSchemaCreators = require('@mpieva/psydb-schema-creators');

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

    // do nothing if record is not dirty
    if (!record.state.isDirty) {
        return;
    }

    var nextSettings = record.state.nextSettings;
    /*var nextState = createClone(record.state);
    nextState.settings = createClone(nextState.nextSettings);

    
    nextState.isNew = false;
    nextState.isDirty = false;


    var { settings, nextSettings } = nextState;*/

    // handle label def

    var collectionCreatorData = allSchemaCreators[record.collection];
    if (!collectionCreatorData) {
        throw new Error(inline`
            no creator data found for collection
            "${record.collection}"
        `);
    }

    var {
        hasSubChannels,
        subChannelKeys,
    } = collectionCreatorData;
    
    /*
    // handle fields
    if (hasSubChannels) {
        subChannelKeys.forEach(key => {
            settings.subChannelFields[key] = (
                settings.subChannelFields[key].map(it => (
                    omit([ 'isNew', 'isDirty'], it)
                ))
            );
            nextSettings.subChannelFields[key].forEach(it => {
                it.isNew = false;
                it.isDirty = false;
            })
        })
    }
    else {
        settings.fields = settings.fields.map(it => (
            omit([ 'isNew', 'isDirty'], it)
        ));
        nextSettings.fields.forEach(it => {
            it.isNew = false;
            it.isDirty = false;
        })
    }


    var diff = createDiff(record.state, nextState);

    var messages = createRohrpostMessagesFromDiff(diff, { prefix: '/state'});
    // FIXME: prefixin because we changed how underlying state
    // calculation works
    messages.forEach(m => {
        m.payload.prop = `/state${m.payload.prop}`;
    });*/

    await dispatch({
        collection: 'customRecordType',
        channelId: id,
        payload: { $set: {
            ...createCopyOps({ hasSubChannels, nextSettings }),
            ...createCleanupOps({ hasSubChannels }),
        }}
    });

    //var doc = await db.collection('customRecordType').findOne({ _id: id });
    //console.dir(doc, { depth: null });

    //throw new Error();

    /*var channel = (
        rohrpost
        .openCollection('customRecordType')
        .openChannel({
            id
        })
    );

    await channel.dispatchMany({
        lastKnownEventId,
        messages,
    });*/
}

var createCopyOps = ({ hasSubChannels, nextSettings }) => {
    var ops;

    if (hasSubChannels) {
        var copy = {};
        ['gdpr', 'scientific'].forEach(key => {
            nextSettings.subChannelFields[key] = (
                copy[key].map(it => (
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
