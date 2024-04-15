'use strict';
var {
    MessageHandler,
    presets
} = require('@mpieva/psydb-api-message-handler-compat');

var handler = MessageHandler({
    type: 'ageFrame/patch',
    stages: {
        ...presets.default({
            createMessagePayloadSchema: require('./schema'),
        }),
        ...require('./verify'),
        ...require('./execute-system'),
    }
})

module.exports = handler;
