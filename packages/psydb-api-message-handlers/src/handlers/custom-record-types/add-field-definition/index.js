'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var BaseSchema = require('./schema'),
    FieldSchemas = require('./field-schemas'),
    allSchemaCreators = require('@mpieva/psydb-schema-creators');

var shouldRun = (message) => (
    message.type === 'custom-record-types/add-field-definition'
)

var checkSchema = async ({ message }) => {
    var ajv = Ajv(),
        isValid = false;

    isValid = ajv.validate(BaseSchema(), message);
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, 'InvalidMessageSchema');
    }

    var FieldSchema = FieldSchemas[message.payload.props.type];
    isValid = ajv.validate(FieldSchema(), message);
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

    if (hasSubChannels) {
        if (!subChannelKey) {
            throw new ApiError(400, 'SubChannelKeyRequired');
        }
        else if (!subChannelKeys.includes(subChannelKey)) {
            throw new ApiError(400, 'UnsupportedSubChannelKey');
        }
    }
    else {
        if (subChannelKey) {
            throw new ApiError(400, 'SubChannelsNotAllowed');
        }
    }

    // TODO: do we have a better idea? since this feels just wrong
    var hasSpecialAgeFrameFlag = false;
    if (props.props.isSpecialAgeFrameField) {
        if (
            record.collection === 'subject'
            && subChannelKey === 'scientific'
        ) {
            hasSpecialAgeFrameFlag = true;
        }
        else {
            throw new ApiError(400, 'SpecialAgeFrameFieldNotAllowed');
        }
    }

    var existingField,
        existingAgeFrameField;
    if (subChannelKey) {
        existingField = (
            record.state.nextSettings.subChannelFields[subChannelKey]
            .find(it => it.key === props.key)
        );
        if (hasSpecialAgeFrameFlag === true) {
            existingAgeFrameField = (
                record.state.nextSettings.subChannelFields[subChannelKey]
                .find(it => it.props.isSpecialAgeFrameField === true)
            );
        }
    }
    else {
        existingField = (
            record.state.nextSettings.fields.find(it => it.key === props.key)
        );
        if (hasSpecialAgeFrameFlag === true) {
            existingAgeFrameField = (
                record.state.nextSettings.fields
                .find(it => it.props.isSpecialAgeFrameField === true)
            );
        }
    }
    if (existingField) {
        throw new ApiError(400, 'DuplicateFieldKey');
    }
    if (existingAgeFrameField) {
        throw new ApiError(400, 'SpecialAgeFrameFieldExists');
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
        ? `/state/nextSettings/subChannelFields/${subChannelKey}`
        : '/state/nextSettings/fields'
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
