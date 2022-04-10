'use strict';
var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var createSchema = require('./create-schema');

var shouldRun = (message) => (
    message.type === 'helperSetItem/create'
)

var checkSchema = async ({ message }) => {
    var schema = createSchema({ op: 'create' }),
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
    var { setId, props } = message.payload;
    
    //if (!permissions.canCreateHelperSetItem()) {
        //throw new ApiError(403);
    //}

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
