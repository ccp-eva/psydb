'use strict';
var Ajv = require('../../lib/ajv');

var withMessageValidation = async (context, next) => {
    var { schemas, permissions, message } = context;
    var { type: messageType } = message;

    // FIXME: this is actually authorization, not validation
    if (!permissions.canUseMessageType(messageType)) {
        debug(`no permission to use message type ${messageType}`);
        throw new Error(403); // TODO
    }

    var found = schemas.messages.filter(
        it => it.messageType === messageType
    );

    if (found < 1) {
        debug(`no schema for message type ${messageType}`);
        throw new Error(400); // TODO
    }

    if (found > 1) {
        debug(`multiple schemas for message type ${messageType}`);
        throw new Error(500); // TODO
    }

    var ajv = Ajv(),
        isValid = ajv.validate(found[0], message);

    if (!isValid) {
        debug(`validation errors for ${messageType}`, ajv.errors);
        throw new Error(400); // TODO
    }

    await next();
};

module.exports = withMessageValidation;
