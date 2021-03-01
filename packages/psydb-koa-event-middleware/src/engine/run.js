'use strict';
var storeNextState = require('./store-next-state');

// triggerMussageEffects ??
// runHandlers ??
// performUpdates ??
var run = ({
    createInitialChannelState,
    handleChannelEvent
}) => async (context, next) => {
    var {
        rohrpost,
        messageHandler,
    } = context;

    try {
        await messageHandler.triggerSystemEvents(context);

        await storeNextState({
            createInitialChannelState,
            handleChannelEvent,
            context
        });
    }
    catch (error) {
        // TODO
        //await rohrpost.rollback()
        throw error;
    }

    // cache modified channels in context to be used
    // by middleware downstream
    context.modifiedChannels = rohrpost.getModifiedChannels();

    await rohrpost.unlockModifiedChannels();
    
    // mails etc
    await messageHandler.triggerOtherSideEffects(context);

    await next();
}

module.exports = run;
