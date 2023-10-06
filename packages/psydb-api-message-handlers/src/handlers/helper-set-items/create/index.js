'use strict';
var {
    ApiError,
    validateOrThrow,
} = require('@mpieva/psydb-api-lib');

var createSchema = require('./create-schema');

var shouldRun = (message) => (
    message.type === 'helperSetItem/create'
)

var checkSchema = async ({ message }) => {
    validateOrThrow({
        schema: createSchema({ op: 'create' }),
        payload: message
    });
}

var checkAllowedAndPlausible = async ({
    db,
    message,
    permissions
}) => {
    var { setId, props } = message.payload;
    
    if (!permissions.hasCollectionFlag('helperSetItem', 'write')) {
        throw new ApiError(403);
    }

    var existingSet = await (
        db.collection('helperSet').findOne({
            _id: setId,
        })
    );

    if (!existingSet) {
        // InvalidHelperSet
        throw new ApiError(400, 'HelperSetNotFound');
    }

    var existingByLabel = await (
        db.collection('helperSetItems').findOne({
            label: props.label
        })
    );

    if (existingByLabel) {
        throw new ApiError(400, 'DuplicateLabel');
    }
}

var triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
    dispatchProps,
}) => {
    var { type: messageType, payload } = message;
    var { id, setId, props } = payload;

    await dispatchProps({
        collection: 'helperSetItem',
        channelId: id,
        isNew: true,
        additionalChannelProps: { setId },
        props,

        // NOTE: helperset items cant be initialize
        //initialize: true
    })
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
