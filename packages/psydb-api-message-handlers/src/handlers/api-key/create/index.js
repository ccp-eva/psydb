'use strict';
var debug = require('debug')('psydb:api:message-handlers');
var { pathify } = require('@mpieva/psydb-core-utils');

var {
    ApiError,
    validateOrThrow,
    generateApiKey,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var __createHandler = () => ({
    shouldRun,
    checkSchema,
    checkAllowedAndPlausible,
    triggerSystemEvents,
    triggerOtherSideEffects
});

var shouldRun = (message) => (
    message.type === 'apiKey/create'
)

var checkSchema = async (context) => {
    var { message } = context;
    
    validateOrThrow({
        schema: Schema(),
        payload: message
    });
} 

var checkAllowedAndPlausible = async (context) => {
    var { permissions } = context;

    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }
}

var triggerSystemEvents = async (context) => {
    var { dispatch, message, personnelId } = context;
    var { props } = message.payload;
    
    var defaults = { isEnable: false, permissions: {}}; // FIXME
    await dispatch({
        collection: 'apiKey',
        additionalChannelProps: {
            apiKey: generateApiKey(),
            personnelId,
        },
        payload: { $set: (
            // FIXME: merge(defaults, pathify(props)) ??
            pathify({ ...defaults, ...props }, { prefix: 'state' })
        )}
    })
}

var triggerOtherSideEffects = async () => {};

module.exports = __createHandler();
