'use strict';
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

    if (!db) {
        throw new InvalidDatabaseHandle(inline`
            context property "db" is invalid;
            failed to get database handle from context property "db"
        `); 
    }

    if (!message || typeof message !== 'object') {
        throw new InvalidMessage(inline`
            context property "message" is invalid;
            message must be an object
        `);
    }

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

    await next;
}


