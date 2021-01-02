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
    
    var { type: messageType } = message;

    var schema = messageHandler.createSchema({
        recordSchemas,
        messageType
    });

    var ajv = Ajv(),
        isValid = ajv.validate(schema, message);

    if (!isValid) {
        debug(`validation errors for ${messageType}`, ajv.errors);
        throw new ApiError(400); // TODO
    }

    try {
        await messageHandler.checkAllowedAndPlausible({
            db,
            permissions,
            message
        });
    }
    catch (error) {
        if (error instanceof ApiError) {
            debug(inline`
                api error with ${error.statusCode}
                while checking permission/plausibility
                of message with type ${messageType}`
            );
        }
        throw error;
    }

    await next();
};

module.exports = checkMessage;
