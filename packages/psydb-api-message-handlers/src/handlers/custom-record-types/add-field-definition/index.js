'use strict';
var debug = require('debug')('psydb:api:message-handlers');
var util = require('util'); // because debug depth

var {
    ApiError,
    compareIds,
    validateOrThrow
} = require('@mpieva/psydb-api-lib');

var BaseSchema = require('./schema'),
    FieldSchemas = require('./field-payload-schemas'),
    allSchemaCreators = require('@mpieva/psydb-schema-creators');

var shouldRun = (message) => (
    message.type === 'custom-record-types/add-field-definition'
)

var checkSchema = async (context) => {
    var { message } = context;
    
    validateOrThrow({
        schema: BaseSchema(),
        payload: message
    });

    var FieldSchema = FieldSchemas[message.payload.props.type];
    
    validateOrThrow({
        schema: FieldSchema(),
        payload: message
    });
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
        lastKnownEventId,
        subChannelKey,
        props,
    } = message.payload;

    var record = await (
        db.collection('customRecordType').findOne({
            _id: id
        })
    );

    if (!record) {
        throw new ApiError(404, 'RecordNotFound');
    }
    
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
        if (record.collection === 'subject') {
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
    personnelId,

    dispatch,
}) => {
    var { payload } = message;
    var {
        id,
        lastKnownEventId,
        subChannelKey,
        props
    } = payload;

    var channel = (
        rohrpost
        .openCollection('customRecordType')
        .openChannel({
            id
        })
    );

    var fieldPointer = (
        subChannelKey
        ? `/${subChannelKey}/state/custom/${props.key}`
        : `/state/custom/${props.key}`
    )

    var pushPath = (
        subChannelKey
        ? `state.nextSettings.subChannelFields.${subChannelKey}`
        : 'state.nextSettings.fields'
    );
    await dispatch({
        collection: 'customRecordType',
        channelId: id,
        payload: {
            $push: {
                [pushPath]: {
                    ...payload.props,
                    pointer: fieldPointer,
                    isNew: true,
                    isDirty: true,
                }
            },
            $set: { 'state.isDirty': true }
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
