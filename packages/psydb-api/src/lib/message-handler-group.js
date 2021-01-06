'use strict';

var MessageHandlerGroup = (handlerList) => {
    checkHandlers(handlerList);

    return async (context) => {
        var didRun = false;

        for (var handler of handlerList) {
            if (didRun) {
                throw new Error(inline`
                    trying to run multiple message handlers
                    for message type ${message.type}
                `);
            }
            else {
                didRun = await handler(context);
            }
        }

        return didRun;
    }
}

var checkHandlers = (handlers) => {
    handlers.forEach(handler => {
        if (typeof handler !== 'function') {
            throw Error(inline`
                message handler is not a function
            `);
        }
    })
}

module.exports = MessageHandlerGroup;
