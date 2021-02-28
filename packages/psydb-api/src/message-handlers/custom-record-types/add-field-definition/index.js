'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('../../../lib/api-error'),
    Ajv = require('../../../lib/ajv');

var Schema = require('./schema'),
    metas = require('@mpieva/psydb-schema').collectionMetadata;

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
        subChannelKey,
        props,
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

    
    var subChannels = metas.getSubChannels({
        collection: record.collection
    });
    if (subChannels.length > 0) {
        if (!subChannelKey) {
            throw new ApiError(400, 'SubChannelKeyRequired');
        }
        else if (!subChannels.includes(subChannelKey)) {
            throw new ApiError(400, 'UnsupportedSubChannelKey');
        }
    }
    else {
        if (subChannelKey) {
            throw new ApiError(400, 'SubChannelsNotAllowed');
        }
    }

    var existingField;
    if (subChannelKey) {
        existingField = (
            record.state.nextSettings.subChannelFields[subChannelKey]
            .find(it => it.key === props.key)
        );
    }
    else {
        existingField = (
            record.state.nextSettings.fields.find(it => it.key === props.key)
        );
    }
    if (existingField) {
        throw new ApiError(400, 'DuplicateFieldKey');
    }
}

var triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,
}) => {
    var { personnelId, payload } = message;
    var { id, subChannelKey, props } = payload;
    var { lastKnownEventId } = cache;

    var channel = (
        rohrpost
        .openCollection('customRecordType')
        .openChannel({
            id
        })
    );

    var pointer = (
        subChannelKey
        ? `/nextSettings/subChannelFields/${subChannelKey}`
        : '/nextSettings/fields'
    )

    await channel.dispatch({
        lastKnownEventId,
        message: {
            type: 'push',
            payload: {
                prop: pointer,
                value: {
                    ...payload.props,
                    isNew: true,
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
