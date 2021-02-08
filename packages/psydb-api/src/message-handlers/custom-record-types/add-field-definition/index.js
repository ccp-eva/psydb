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
    cache,
    message
}) => {
    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

    var {
        id,
        subChannel,
    } = message.payload;

    var records = await (
        db.collection('customRecordType').find({
            _id: id
        }).toArray()
    );

    if (records.length < 1) {
        throw new ApiError(404, 'CustomRecordTypeNotFound');
    }
    
    var record = cache.record = records[0];
    cache.lastKnownEventId = record.events[0]._id;

    // TODO: check if subChannel has record state schema
    // or throw 400 NoSubChannelSupport
    // <= record type can not have sub channels

    // TODO: check if key exists
    // in the channel/subchannel nextFields
    // or throw 400 DuplicateFieldKey
}

var triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,
}) => {
    var { personnelId, payload } = message;
    var { id, props } = payload;
    var { lastKnownEventId } = cache;

    var channel = (
        rohrpost
        .openCollection('customRecordType')
        .openChannel({
            id
        })
    );

    await channel.dispatch({
        lastKnownEventId,
        message: {
            type: 'push',
            payload: {
                // TODO: subchannels
                prop: '/nextFields',
                value: {
                    ...payload.props,
                    isDirty: true,
                }
            }
        }
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
