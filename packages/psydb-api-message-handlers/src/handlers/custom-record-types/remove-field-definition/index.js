'use strict';
var { MessageHandler, presets }
    = require('@mpieva/psydb-api-message-handler-compat');

var handler = MessageHandler({
    type: 'custom-record-types/remove-field-definition',
    stages: {
        ...presets.empty(),
        ...require('./validate'),
        ...require('./verify'),
        ...require('./execute-system'),
        //...require('./response'),
    }
})

module.exports = handler;
