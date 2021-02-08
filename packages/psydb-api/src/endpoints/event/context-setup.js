'use strict';
var createContextSetupMiddleware = ({
    forcedPersonnelId
} = {}) => async (context, next) => {
    if (context.request.body) {
        context.message = context.request.body;
    }
    else {
        throw new Error('no request body') // TODO
    }

    context.personnelId = (
        context.session && context.session.personnelId
        ? context.session.personnelId
        : forcedPersonnelId
    );

    if (!context.personnelId){
        throw new Error('no personnelId') // TODO
    }

    // used within message handlers
    // to cache some values i.e. lastKnownMessageId
    context.cache = {};

    await next();
};

module.exports = createContextSetupMiddleware;
