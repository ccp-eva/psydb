'use strict';
var inline = require('@cdxoo/inline-text');

var { MessageHandlerNotFound } = require('../errors/');

var checkMessage = async (context, next) => {
    var {
        db,
        messageHandler,
    } = context;

    if (!messageHandler.shouldRun(message)) {
        throw new MessageHandlerNotFound(inline`
            there was no runnable message handler
            found for type "${message.type}"
        `);
    }

    // recordSchemas, message
    await messageHandler.checkSchema(context);
    // db, permissions, cache, message
    await messageHandler.checkAllowedAndPlausible(context);

    /*try {
        await messageHandler.checkSchema({
            recordSchemas, message
        });
        await messageHandler.checkAllowedAndPlausible({
            db, permissions, cache, message
        });
    }
    catch (error) {
        if (error instanceof ApiError) {
            var info = error.getInfo();
            debug(inline`
                api error with ${info.apiStatus}
                while performing message checks
                for message with type ${message.type}`
            );
        }
        throw error;
    }*/

    await next();
};

module.exports = checkMessage;
