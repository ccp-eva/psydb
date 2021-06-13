'use strict';
var inline = require('@cdxoo/inline-text');
var MessageHandler = require('./message-handler');
var { MessageHandlerConflict } = require('../errors/');

var MessageHandlerGroup = (specList) => {
    var handlerList = specList.map(MessageHandler);

    var findRunnableHandler = (message) => {
        var runnableHandlers = handlerList.filter(handler => (
            handler.shouldRun(message)
        ));
        
        if (runnableHandlers.length > 1) {
            throw new MessageHandlerConflict(inline`
                found multiple message handlers for type "${message.type}"
            `)
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
