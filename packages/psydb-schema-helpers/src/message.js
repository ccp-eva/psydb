'use strict';
var { ExactObject } = require('@mpieva/psydb-schema-fields');

var Message = ({ type, payload }) => ExactObject({
    properties: {
        type: { const: type },
        payload,
    },
    required: [
        'type',
        'payload',
    ],
});

module.exports = Message;
