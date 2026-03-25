'use strict';
var {
    MessageHandler,
    presets
} = require('@mpieva/psydb-api-message-handler-compat');

var handler = MessageHandler({
    type: 'study/create',
    stages: {
        ...presets.empty(),
        ...require('./validate'),
        ...require('./verify'),
        //...require('./execute-system'),
        //...require('./response'),
    }
})

module.exports = handler;
