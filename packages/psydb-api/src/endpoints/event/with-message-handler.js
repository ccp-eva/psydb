'use strict';
var debug = require('debug')('psydb:api:endpoints:event');

var ApiError = require('../../lib/api-error'),
    HandlerRegistry = require('../../message-handlers/');

var withMessageHandler = async (context, next) => {
    var { type: messageType } = context.message;
    
    var messageHandler = HandlerRegistry().find(messageType);
    if (!messageHandler) {
        debug(`no handler for message type ${messageType}`);
        throw new ApiError(400); // TODO
    }

    context.messageHandler = messageHandler;

    await next();
}

module.exports = withMessageHandler;
