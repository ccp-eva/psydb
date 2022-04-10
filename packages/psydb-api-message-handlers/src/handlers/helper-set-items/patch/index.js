'use strict';
var { Ajv, ApiError } = require('@mpieva/psydb-api-lib');

var shouldRun = (message) => (
    message.type === 'helperSetItem/patch'
)

var Schema = require('./schema');

var checkSchema = async ({ message }) => {
    var schema = Schema(),
        ajv = Ajv(),
        isValid = ajv.validate(schema, message);

    if (!isValid) {
        throw new ApiError(400, 'InvalidMessageSchema');
    }
}

var checkAllowedAndPlausible = async ({
    db,
    message,
    permissions
}) => {
    var { id, lastKnownEventId, props } = message.payload;
    
    if (!permissions.hasCollectionFlag('helperSetItem', 'write')) {
        throw new ApiError(403);
    }

    console.log(id);
    var existing = await (
        db.collection('helperSetItem').findOne({
            _id: id,
        })
    );
    console.log(existing);

    if (!existing) {
        throw new ApiError(400, 'HelperSetItemNotFound');
    }
}

var triggerSystemEvents = async ({
    db,
    rohrpost,
    message,

    dispatchProps,
}) => {
    var { type: messageType, payload } = message;
    var { id, props } = payload;
    await dispatchProps({
        collection: 'helperSetItem',
        channelId: id,
        props
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
