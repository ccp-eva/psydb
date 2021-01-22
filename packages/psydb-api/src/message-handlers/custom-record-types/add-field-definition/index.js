'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('../../../lib/api-error'),
    Ajv = require('../../../lib/ajv');

var Schema = require('./schema');

var shouldRun = (message) => (
    message.type === 'custom-record-types/add-field-definition'
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
        lastKnownMessageId,
    } = message.payload;

    var existing = await (
        db.collection('customRecordType').find({
            _id: id
        }).toArray()
    );

    if (existing.length < 1) {
        throw new ApiError(404, 'CustomRecordTypeNotFound');
    }
}

var triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
}) => {
    var { personnelId, payload } = message;
    var { id, lastKnownMessageId, props } = payload;

    // FIXME: dispatch silently ignores messages when id is set
    // but record doesnt exist
    var channel = (
        rohrpost
        .openCollection('customRecordType')
        .openChannel({
            id
        })
    );

    ({ lastKnownMessageId } = await channel.dispatch({ message: {
        type: 'put',
        lastKnownMessageId,
        payload: {
            prop: '/label',
            value: props.label
        }
    }}));

    // datensatz-beschriftung
    ({ lastKnownMessageId } = await channel.dispatch({ message: {
        type: 'put',
        payload: {
            prop: '/recordLabelDefinition',
            value: props.recordLabelDefinition
        }
    }}));

    // TODO: we need diff here i think
    /*await channel.dispatch({ message: {
        type: 'put',
        prop: '/fields',
        value: props.fields
    }});*/
    
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
