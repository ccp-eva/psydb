'use strict';
var {
    MessageHandler,
    presets
} = require('@mpieva/psydb-api-message-handler-compat');

var handler = MessageHandler({
    type: 'experiment/create-manual',
    stages: {
        ...presets.default(),
        ...require('./validate'),
        ...require('./verify'),
        ...require('./execute-system'),
    }
})

module.exports = handler;
