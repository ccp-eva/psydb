'use strict';
var debug = require('debug')('psydb:api:endpoints:event');

var MessageHandlerGroup = require('../../lib/message-handler-group'),
    messageHandlers = require('../../message-handlers/');

var withMessageHandler = async (context, next) => {
    context.messageHandler = MessageHandlerGroup(messageHandlers);
    await next();
}

module.exports = withMessageHandler;
