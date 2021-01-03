'use strict';
var messageType = require('./message-type'),
    createSchema = require('./create-schema'),
    parseMessageType = require('./parse-message-type');

var checkAllowedAndPlausible = async ({
    db,
    message,
    permissions
}) => {
    var { type: messageType, payload } = message;
    var { op, set } = parseMessageType(messageType);
    
    if (op === 'create') {
        if (!permissions.canCreateHelperSetItem()) {
            throw new ApiError(403);
        }
    }
    else if (op === 'patch') {
        if (!permissions.canPatchHelperSetItems()) {
            throw new ApiError(403);
        }
    }
    else {
        // unknown op
        throw new ApiError(400); // TODO 
    }

    var existingSet = await (
        db.collection('helperSet').findOne({
            _id: set,
        })
    );

    if (!existingSet) {
        // InvalidHelperSet
        throw new ApiError(400);
    }

    if (op === 'patch') {
        var stored = await (
            db.collection('helperSetItem').findOne({
                _id: payload.id,
                'state.set': set
            })
        );
        if (!stored) {
            // ImplausibleValue
            throw new ApiError(400);
        }
    }
}

var triggerSystemEvents = async ({
    rohrpost,
    message,
}) => {
    var { type: messageType, personnelId, payload } = message;
    var { op, set } = parseMessageType(messageType);

    var channel = (
        rohrpost
        .openCollection('helperSetItem')
        .openChannel({
            id: payload.id,
            isNew: op === 'create',
            additionalChannelProps: { set }
        })
    );

    /*if (op === 'create') {
        await channel.dispatch({ message: {
            type: 'put',
            personnelId,
            payload: {
                prop: '/set',
                value: set
            }
        }});
    }*/
    
    await channel.dispatch({ message: {
        type: 'put',
        personnelId,
        payload: {
            prop: '/label',
            value: payload.label
        }
    }});

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
