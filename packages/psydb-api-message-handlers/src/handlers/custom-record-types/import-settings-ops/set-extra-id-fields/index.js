'use strict';
var { MessageHandler, presets }
    = require('@mpieva/psydb-api-message-handler-compat');

var handler = MessageHandler({
    type: 'custom-record-types/import-settings-ops/set-extra-id-fields',
    stages: {
        ...presets.default({
            createMessagePayloadSchema: require('./schema'),
        }),
        ...require('./verify'),
        ...require('./execute-system'),
        //...require('./response'),
    }
})

module.exports = handler;
