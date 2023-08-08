'use strict'
var Cache = require('./cache');

var createShouldRun = (type) => ({ message, handler }) => (
    message.type === handler.type
);

var MessageHandler = (options) => {
    var {
        type,
        stages,
        shouldRun,
        ...otherOptions
    } = options;
    
    shouldRun = shouldRun || createShouldRun(type)

    var internalHandlerObject = {
        _t: 'handler',
        type,
        stages,
        options: otherOptions,
    };

    var createCompatContext = (orig) => {
        // FIXME: im not sure why i need to explicitely
        // specify message for destructuring
        // but it wont be included in '...rest' for some reason by default
        var { cache: cache_v1, message, ...rest } = orig;
        var cache_v2 = Cache();
        cache_v2.merge(cache_v1);

        return {
            ...rest,
            message,
            handler: internalHandlerObject,
            cache: cache_v2
        }
    }

    var wrap = (stage) => async (context) => {
        var compatContext = createCompatContext(context);
        await stage(compatContext);
        context.cache = compatContext.cache.get();
    }

    var handler = {
        shouldRun: (message) => shouldRun({
            message,
            handler: internalHandlerObject
        }),
        checkSchema: wrap(stages.validateMessage),
        checkAllowedAndPlausible: wrap(stages.verifyAllowedAndPlausible),
        triggerSystemEvents: wrap(stages.executeSystemEvents),
        triggerOtherSideEffects: wrap(stages.executeRemoteEffects)
    }

    return handler;
}

module.exports = MessageHandler;
