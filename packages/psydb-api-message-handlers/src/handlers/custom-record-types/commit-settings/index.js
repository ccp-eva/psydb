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
        throw new ApiError(403);
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
        .findOne({
            _id: id,
            'events.0._id': lastKnownEventId
        })
    );

    if (!record) {
        // FIXME: 409?
        // FIXME: name of tha status .... mke clear that it as changed
        // by someone else, and we cann not be sure that we perform the
        // operation safely (UnsafeRecordUpdate?)
        throw new ApiError(400, 'RecordHasChanged');
    }

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
}) => {
    var { personnelId, payload } = message;
    var { id, lastKnownEventId, props } = payload;
    var { record } = cache;

    var nextState = createClone(record.state);
    nextState.settings = createClone(nextState.nextSettings);

    
    nextState.isNew = false;
    nextState.isDirty = false;


    var { settings, nextSettings } = nextState;

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
    })

        /*if (subChannels.length) {
        console.dir(nextState, { depth: null });
        console.dir(diff, { depth: null });
        console.dir(messages, { depth: null });

        //throw new Error();
    }*/

    var channel = (
        rohrpost
        .openCollection('customRecordType')
        .openChannel({
            id
        })
    );

    await channel.dispatchMany({
        lastKnownEventId,
        messages,
    });

}

module.exports = handler;
