'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var Schema = require('./schema');

var shouldRun = (message) => (
    message.type === 'custom-record-types/set-record-label-definition'
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

    // TODO: to make the checks we need to create
    // a default state object of the related record collection

    var { format, tokens } = props;
    // TODO: check tokens agains nextFields
    // TODO: check format placeholders against token count
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

    await channel.dispatchMany({
        lastKnownEventId,
        messages: [
            {
                type: 'put',
                payload: {
                    // datensatz-beschriftung
                    prop: '/state/nextSettings/recordLabelDefinition',
                    value: {
                        isDirty: true,
                        ...props
                    }
                }
            }
        ],
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
