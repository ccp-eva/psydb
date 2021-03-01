'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('../../../lib/api-error'),
    Ajv = require('../../../lib/ajv');

var Schema = require('./schema');

var shouldRun = (message) => (
    message.type === 'custom-record-types/create'
)

var checkSchema = async ({ message }) => {
    var ajv = Ajv(),
        isValid = false;

    /*var {
        collection,
        type
    } = message.payload;

    isValid = ajv.validate(
        PreprocessingSchema(),
        { collection, type }
    );
    if (!isValid) {
        throw new ApiError(400, 'InvalidMessageSchema');
    }*/

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
        collection,
        type,
    } = message.payload;

    var existing = await (
        db.collection('customRecordType').find({
            collection,
            type
        }).toArray()
    );

    if (existing.length > 0) {
        throw new ApiError(400, 'DuplicateCustomRecordType');
    }
}

var triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
}) => {
    var { id, collection, type, props } = message.payload;

    // FIXME: dispatch silently ignores messages when id is set
    // but record doesnt exist
    var channel = (
        rohrpost
        .openCollection('customRecordType')
        .openChannel({
            id,
            isNew: true,
            additionalChannelProps: { collection, type }
        })
    );

    await channel.dispatchMany({ messages: [
        {
            type: 'put',
            payload: {
                prop: '/state/label',
                value: props.label
            }
        },
        // FIXME: record label definition this needs its own action i guess
        /*{
            type: 'put',
            payload: {
                // datensatz-beschriftung
                prop: '/nextSettings/recordLabelDefinition',
                value: props.recordLabelDefinition
            }
        }*/
    ]});

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
