'use strict';
var createContextSetupMiddleware = ({
    forcedPersonnelId
} = {}) => async (context, next) => {
    if (context.request.body) {
        // TODO: mq needs to accept custom message metadata
        context.message = context.request.body;
    }
    else {
        throw new Error('no request body') // TODO
    }

    var personnelId = (
        context.session && context.session.personnelId
        ? context.session.personnelId
        : forcedPersonnelId
    );

    if (personnelId) {
        context.message.personnelId = personnelId;
    }
    else {
        throw new Error('no personnelId') // TODO
    }

    await next();
};

module.exports = createContextSetupMiddleware;
