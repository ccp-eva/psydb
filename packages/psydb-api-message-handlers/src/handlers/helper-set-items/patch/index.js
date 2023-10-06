'use strict';
var {
    ApiError,
    validateOrThrow,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var shouldRun = (message) => (
    message.type === 'helperSetItem/patch'
)

var checkSchema = async ({ message }) => {
    validateOrThrow({
        schema: Schema(),
        payload: message
    });
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

    var existing = await (
        db.collection('helperSetItem').findOne({
            _id: id,
        })
    );
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
