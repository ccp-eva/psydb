'use strict';
var {
    MessageHandler,
    presets
} = require('@mpieva/psydb-api-message-handler-compat');

var handler = MessageHandler({
    type: 'self/set-forced-research-group',
    stages: {
        ...presets.default({
            createMessagePayloadSchema: require('./schema')
        }),
        ...require('./verify'),
        ...require('./execute-system'),
        ...require('./response'),
    }
})

module.exports = handler;
