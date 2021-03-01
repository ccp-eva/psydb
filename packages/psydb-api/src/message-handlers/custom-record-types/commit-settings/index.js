'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var omit = require('@cdxoo/omit'),
    createClone = require('copy-anything').copy,
    createDiff = require('deep-diff');

var ApiError = require('../../../lib/api-error'),
    Ajv = require('../../../lib/ajv');

var createRohrpostMessagesFromDiff = require('../../../lib/diff-to-rohrpost');

var Schema = require('./schema'),
    metas = require('@mpieva/psydb-schema').collectionMetadata;

var shouldRun = (message) => (
    message.type === 'custom-record-types/commit-settings'
)

var checkSchema = async ({ message }) => {
    var ajv = Ajv(),
        isValid = false;

    isValid = ajv.validate(Schema(), message);
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, 'InvalidMessageSchema');
    }
}

var checkAllowedAndPlausible = async ({
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

var triggerSystemEvents = async ({
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
    settings.recordLabelDefinition = omit(
        'isDirty', settings.recordLabelDefinition
    );
    nextSettings.recordLabelDefinition.isDirty = false;

    // handle fields
    var subChannels = metas.getSubChannels({
        collection: record.collection
    });
    if (subChannels) {
        subChannels.forEach(key => {
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
    //console.dir(diff, { depth: null });

    var messages = createRohrpostMessagesFromDiff(diff);
    //console.dir(messages, { depth: null });

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


// no-op
var triggerOtherSideEffects = async () => {};

module.exports = {
    shouldRun,
    checkSchema,
    checkAllowedAndPlausible,
    triggerSystemEvents,
    triggerOtherSideEffects,
}
