'use strict';
var messageType = require('./message-type'),
    createSchema = require('./create-schema'),
    parseMessageType = require('./parse-message-type');

var checkAllowedAndPlausible = async ({
    db,
    permissions,
    message
}) => {
    var { type: messageType, payload } = message;
    var { op } = parseMessageType(messageType);

    if (op === 'create') {
        if (!permissions.canCreateHelperSet()) {
            throw new ApiError(403);
        }
    }
    // TODO: patch
    else {
        // unknown op
        throw new ApiError(400); // TODO 
    }
}

var triggerSystemEvents = async ({
    db,
    rohrpost,
    message
}) => {
    var { type: messageType, personnelId, payload } = message;
    var { op } = parseMessageType(messageType);

    // FIXME: dispatch silently ignores messages when id is set
    // but record doesnt exist
    var channel = (
        rohrpost
        .openCollection(collection)
        .openChannel({ id: payload.id, isNew: op === 'create' })
    );
    
    await channel.dispatch({ message: {
        type: 'put',
        personnelId,
        payload: {
            prop: 'label',
            value: payload.label
        }
    }})
}

// no-op
var triggerOtherSideEffects = async () => {};

module.exports = {
    messageType,
    createSchema,
    checkAllowedAndPlausible,
    triggerSystemEvents,
    triggerOtherSideEffects,
}
