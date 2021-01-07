'use strict';
var debug = require('debug')('psydb:api:endpoints:event');

var inline = require('@cdxoo/inline-text');

var ApiError = require('../../lib/api-error'),
    Ajv = require('../../lib/ajv');

var checkMessage = async (context, next) => {
    var {
        db,
        permissions,
        recordSchemas,
        messageHandler,
        message
    } = context;

    if (!message || typeof message !== 'object') {
        throw new ApiError(400, 'InvalidMessage');
    }

    if (!message.type || typeof message.type !== 'string') {
        throw new ApiError(400, 'InvalidMessage');
    }
    
    if (!message.payload || typeof message.payload !== 'object') {
        throw new ApiError(400, 'InvalidMessage');
    }

    if (!messageHandler.shouldRun(message)) {
        debug(inline`
            no handler found for message with
            type ${message.type}`
        );
        throw new ApiError(400, 'NoMessageHandler');
    }

    try {
        await messageHandler.checkSchema({
            recordSchemas, message
        });
        await messageHandler.checkAllowedAndPlausible({
            db, permissions, message
        });
    }
    catch (error) {
        if (error instanceof ApiError) {
            debug(inline`
                api error with ${error.statusCode}
                while performing message checks
                for message with type ${message.type}`
            );
        }
        throw error;
    }

    await next();
};

module.exports = checkMessage;
