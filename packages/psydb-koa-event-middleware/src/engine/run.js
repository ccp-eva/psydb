'use strict';
var fns = require('./run-context-fns');

// triggerMussageEffects ??
// runHandlers ??
// performUpdates ??
var run = () => async (context, next) => {
    var { rohrpost, messageHandler } = context;
    context.modifiedChannels = [];

    var withContext = (fn) => (
        (...args) => fn(context, args)
    );

    context.dispatch = withContext(fns.dispatch);
    context.dispatchProps = withContext(fns.dispatchProps);
    context.dispatch.makeClean = withContext(fns.makeClean);
    //context.dispatch.makeDistClean = withContext(fns.makeDistClean);

    try {
        await messageHandler.triggerSystemEvents(context);
    }
    catch (error) {
        // TODO
        //await rohrpost.rollback()
        throw error;
    }

    // mails etc
    await messageHandler.triggerOtherSideEffects(context);

    if (messageHandler.createResponseBody) {
        await messageHandler.createResponseBody(context);
    }

    await next();
}

module.exports = run;
