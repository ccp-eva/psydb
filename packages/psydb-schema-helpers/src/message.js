'use strict';
var { ExactObject, Timezone } = require('@mpieva/psydb-schema-fields');

var Message = ({ type, payload }) => ExactObject({
    properties: {
        type: { const: type },
        timezone: Timezone(),
        payload,
    },
    required: [
        'type',
        'timezone',
        'payload',
    ],
});

module.exports = Message;
