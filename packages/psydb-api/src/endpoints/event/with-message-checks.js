'use strict';
var withMessageChecks = async (context, next) => {
    var { message, messageHandler, recordSchemas } = context;

    var schema = messageHandler.createSchema({
        recordSchemas
        messageType,
    });

    var ajv = Ajv(),
        isValid = ajv.validate(schema, message);

    if (!isValid) {
        debug(`validation errors for ${messageType}`, ajv.errors);
        throw new ApiError(400); // TODO
    }

    messageHandler.checkAllowedAndPlausible({
        db, permissions, message
    });

    await next();
}

module.exports = withMessageChecks;
