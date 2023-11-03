'use strict';

var allSchemaCreators = require('@mpieva/psydb-schema-creators');
var {
    ApiError,
    validateOrThrow,
} = require('@mpieva/psydb-api-lib');

var BaseSchema = require('./base-schema');

var shouldRun = (message) => (
    message.type === 'custom-record-types/patch-field-definition'
);

var checkSchema = async ({ message }) => {
    validateOrThrow({
        payload: message,
        schema: BaseSchema()
    });

    //var FieldSchema = FieldSchemas[message.payload.props.type];
    //validateOrThrow({
    //    payload: message,
    //    schema: FieldSchema()
    //});
}

var checkAllowedAndPlausible = async (context) => {
    var {
        db,
        permissions,
        cache,
        message
    } = context;

    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

    var {
        id,
        subChannelKey,
        fieldKey,
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

    var fields = (
        subChannelKey
        ? record.state.nextSettings.subChannelFields[subChannelKey]
        : record.state.nextSettings.fields
    );

    var fieldIndex = fields.findIndex(it => it.key === fieldKey);
    if (fieldIndex < 0) {
        throw new ApiError(400, 'TargetFieldNotFound');
    }

    cache.fieldIndex = fieldIndex;
}

var triggerSystemEvents = async (context) => {
    var { message, cache, dispatch } = context;
    var { fieldIndex } = cache;

    var { id, subChannelKey, fieldKey, props } = message.payload;
    var { displayName, displayNameI18N, props: fieldProps } = props;

    var allFieldsPath = (
        subChannelKey
        ? `state.nextSettings.subChannelFields.${subChannelKey}`
        : 'state.nextSettings.fields'
    );

    var fieldPath = (
        `${allFieldsPath}.${fieldIndex}`
    );

    var pathified = pathify(fieldProps, { prefix: `${fieldPath}.props`});
    console.log(pathified);

    await dispatch({
        collection: 'customRecordType',
        channelId: id,
        payload: {
            $set: {
                'state.isDirty': true,
                [`${fieldPath}.isDirty`]: true,
                [`${fieldPath}.displayName`]: displayName,
                [`${fieldPath}.displayNameI18N`]: displayNameI18N,
                ...(fieldProps && pathified)
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
