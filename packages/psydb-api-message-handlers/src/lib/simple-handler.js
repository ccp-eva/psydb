'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var SimpleHandler = ({ messageType, createSchema }) => ({
    shouldRun:  (message) => (
        messageType === message.type
    ),

    checkSchema: async ({ message }) => {
        var schema = createSchema(),
            ajv = Ajv(),
            isValid = ajv.validate(schema, message);

        if (!isValid) {
            debug(message.type, ajv.errors);
            throw new ApiError(400, {
                apiStatus: 'InvalidMessageSchema',
                data: { ajvErrors: ajv.errors }
            });
        }
    },

    checkAllowedAndPlausible: async () => {
        throw new Error('checkAllowedAndPlausible() must be implemented');
    },

    triggerSystemEvents: async () => {
        throw new Error('triggerSystemEvents() must be implemented');
    },

    // no-op by default
    triggerOtherSideEffects: async () => {},
});

module.exports = SimpleHandler;
