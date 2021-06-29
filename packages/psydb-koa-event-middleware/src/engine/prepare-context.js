'use strict';
var copy = require('copy-anything').copy;
var inline = require('@cdxoo/inline-text');

var {
    InvalidDatabaseHandle,
    InvalidMessage
} = require('../errors/');

var prepareContext = ({
    rootHandler
}) => async (context, next) => {
    var {
        db,
        message
    } = context;

    if (!message.type || typeof message.type !== 'string') {
        throw new InvalidMessage(inline`
            context property "message" is invalid;
            message object must have property "type" that is a string
        `);
    }
    
    if (!message.payload || typeof message.payload !== 'object') {
        throw new InvalidMessage(inline`
            context property "message" is invalid;
            message object must have property "payload" that is an object
        `);
    }

    
    context.messageHandler = rootHandler;
    // FIXME: ajv modified the message body when transformations are in play
    // mq would archive that, which we need to prevent
    context.originalMessage = copy(context.message);

    await next();
}

module.exports = prepareContext;
