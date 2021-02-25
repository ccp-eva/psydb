'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var omit = require('@cdxoo/omit'),
    createClone = require('copy-anything').copy,
    createDiff = require('deep-diff');

var ApiError = require('../../../lib/api-error'),
    Ajv = require('../../../lib/ajv');

var Schema = require('./schema');

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
    message
}) => {
    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

    var {
        id,
    } = message.payload;

    var existing = await (
        db.collection('customRecordType').find({
            _id: id
        }).toArray()
    );

    if (existing.length < 1) {
        throw new ApiError(404, 'CustomRecordTypeNotFound');
    }

    // TODO: check if record label definition is still valid
    // TODO: maybe check if every field that is included
    // in the currently fixed settings is equal to the field
    // in next Settings .... on the other hand that shouldnt happen
    // in the first place we should prevent that
}

var triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
}) => {
    var { personnelId, payload } = message;
    var { id, lastKnownEventId, props } = payload;

    // FIXME: dispatch silently ignores messages when id is set
    // but record doesnt exist
    var channel = (
        rohrpost
        .openCollection('customRecordType')
        .openChannel({
            id
        })
    );

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

    var nextState = createClone(record.state);
    nextState.settings = createClone(nextState.nextSettings);

    var { settings, nextSettings } = nextState;

    settings.recordLabelDefinition = omit(
        'isDirty', settings.recordLabelDefinition
    );
    settings.fields = settings.fields.map(it => (
        omit([ 'isNew', 'isDirty'], it)
    ));

    nextSettings.recordLabelDefinition.isDirty = false;
    nextSettings.fields.forEach(it => {
        it.isNew = false;
        it.isDirty = false;
    })


    // NOTE: update-hanlders
    // NOTE: keep rohrpost messages strictly to put etc
    var diff = createDiff(record.state, nextState);
    console.dir(diff, { depth: null });

    throw new Error();

    /*var cleaningOps = [],
        commitedFields = [];
    for (var [ index, field ] of record.state.nextFields.entries()) {
        var { isDirty, ...commitableField } = field;

        commitedFields.push(commitableField);
        
        if (isDirty) {
            cleaningOps.push({
                type: 'put',
                payload: {
                    prop: `/nextFields/${index}/isDirty`,
                    value: false
                }
            })
        }
    }

    await channel.dispatchMany({
        lastKnownEventId,
        messages: [
            {
                type: 'put',
                payload: {
                    prop: '/fields',
                    value: commitedFields,
                }
            },
            ...cleaningOps,
        ]
    });*/

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
