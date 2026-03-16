'use strict';
var { dispatch, dispatchProps } = require('./run-context-fns');

var addFN = (bag) => {
    var { context, ...rest } = bag;
    var [ key, fn ] = Object.entries(rest)[0];

    context[key] = (...args) => (
        fn(context, args)
    );
}

// triggerMussageEffects ??
// runHandlers ??
// performUpdates ??
var run = () => async (context, next) => {
    var { rohrpost, messageHandler } = context;

    context.modifiedChannels = [];

    addFN({ context, dispatch: dispatch });
    addFN({ context, dispatchProps: dispatchProps });

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
