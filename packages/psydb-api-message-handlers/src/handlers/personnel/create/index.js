'use strict';
var {
    MessageHandler,
    presets
} = require('@mpieva/psydb-api-message-handler-compat');

var handler = MessageHandler({
    type: 'personnel/create',
    stages: {
        ...presets.default({
            createMessagePayloadSchema: require('./schema'),
        }),
        ...require('./verify'),
        ...require('./execute-system'),
        ...require('./execute-remote'),
    }
})

module.exports = handler;
