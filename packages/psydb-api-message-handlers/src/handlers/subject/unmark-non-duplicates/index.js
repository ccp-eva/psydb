'use strict';
var {
    MessageHandler,
    presets
} = require('@mpieva/psydb-api-message-handler-compat');

var handler = MessageHandler({
    type: 'subject/unmark-non-duplicates',
    stages: {
        ...presets.default({
            createMessagePayloadSchema: require('./schema'),
        }),
        ...require('./verify'),
        ...require('./execute-system'),
        ...require('./response'),
    }
})

module.exports = handler;
