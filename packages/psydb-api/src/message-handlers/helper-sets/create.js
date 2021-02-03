'use strict';
var ApiError = require('../../lib/api-error'),
    Ajv = require('../../lib/ajv');

var createSchema = require('./create-schema'),
    parseMessageType = require('./parse-message-type');

var shouldRun = (message) => (
    message.type === 'helper-sets/create'
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
    permissions,
    message
}) => {
    if (!permissions.canCreateHelperSet()) {
        throw new ApiError(403);
    }
}

var triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var { id, props } = payload;

    // FIXME: dispatch silently ignores messages when id is set
    // but record doesnt exist
    var channel = (
        rohrpost
        .openCollection('helperSet')
        .openChannel({ id, isNew: true })
    );
    
    await channel.dispatch({ message: {
        type: 'put',
        personnelId,
        payload: {
            prop: '/label',
            value: props.label
        }
    }})
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
