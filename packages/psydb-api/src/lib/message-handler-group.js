'use strict';
var MessageHandler = require('./message-handler');

var MessageHandlerGroup = (specList) => {
    var handlerList = specList.map(MessageHandler);

    var findRunnableHandler = (message) => {
        var runnableHandlers = handlerList.filter(handler => (
            handler.shouldRun(message)
        ));
        
        if (runnableHandlers.length > 1) {
            throw new ApiError(400, 'ConflictingMessageHandlers');
        }

        var handler = runnableHandlers.shift();
        return handler;
    }

    var group = {};

    group.shouldRun = (message) => {
        var handler = findRunnableHandler(message);
        return (
            handler ? true : false
        );
    };

    [
        'checkSchema',
        'checkAllowedAndPlausible',
        'triggerSystemEvents',
        'triggerOtherSideEffects',
    ].forEach(prop => {
        group[prop] = (context) => (
            findRunnableHandler(context.message)[prop](context)
        )
    })
    
    return group;
}

module.exports = MessageHandlerGroup;
