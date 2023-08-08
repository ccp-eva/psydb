'use strict';
var debug = require('debug')('psydb-api-message-handler-compat:presets');
var { Ajv, ApiError } = require('@mpieva/psydb-api-lib');
var { Message } = require('@mpieva/psydb-schema-helpers');

var emptyPreset = require('./empty-preset');

var defaultPreset = (options = {}) => {
    var { createMessagePayloadSchema } = options;

    return {
        ...emptyPreset(),
        validateMessage: async (context) => {
            var { handler, message } = context;
            var payloadSchema = await createMessagePayloadSchema(context);

            var messageSchema = Message({
                type: handler.type,
                payload: payloadSchema
            });

            var ajv = Ajv();
            var isValid = ajv.validate(messageSchema, message);
            if (!isValid) {
                debug(ajv.errors);
                throw new ApiError(400, {
                    apiStatus: 'InvalidMessageSchema',
                    data: { ajvErrors: ajv.errors }
                });
            }
        },
        executeSystemEvents: async (context) => {
            throw new Error('executeSystemEvents() must be implemented');
        },
    }
}

module.exports = defaultPreset;
