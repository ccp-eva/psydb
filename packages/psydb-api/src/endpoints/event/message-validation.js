'use strict';
var debug = require('debug')('psydb:api:endpoints:event');

var ApiError = require('../../lib/api-error'),
    Ajv = require('../../lib/ajv');

var withMessageValidation = async (context, next) => {
    var { recordSchemas, permissions, message } = context;
    var { type: messageType } = message;

    var messageHandler = HandlerRegistry().find(messageType);
    if (!messageHandler) {
        debug(`no handler for message type ${messageType}`);
        throw new ApiError(400); // TODO
    }

    // FIXME: this is actually authorization, not validation
    if (!permissions.canUseMessageType(messageType)) {
        debug(`no permission to use message type ${messageType}`);
        throw new ApiError(403); // TODO
    }

    var ajv = Ajv(),
        isValid = ajv.validate(found, message);

    if (!isValid) {
        debug(`validation errors for ${messageType}`, ajv.errors);
        throw new ApiError(400); // TODO
    }

    await next();
};

module.exports = withMessageValidation;
