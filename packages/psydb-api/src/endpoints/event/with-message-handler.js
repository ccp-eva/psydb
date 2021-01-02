'use strict';
var debug = require('debug')('psydb:api:endpoints:event');

var ApiError = require('../../lib/api-error'),
    HandlerRegistry = require('../../message-handlers/');

var { InvalidHandlerCount } = require('../../message-handlers/errors');

var withMessageHandler = async (context, next) => {
    var { type: messageType } = context.message;

    try {
        context.messageHandler = HandlerRegistry().find(messageType);
    }
    catch (error) {
        if (error instanceof InvalidHandlerCount) {
            debug(`no handler for message type ${messageType}`);
            throw new ApiError(400); // TODO
        }
        else {
            throw error;
        }
    }
    
    await next();
}

module.exports = withMessageHandler;
