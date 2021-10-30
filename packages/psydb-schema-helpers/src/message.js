'use strict';
var { ExactObject, Integer } = require('@mpieva/psydb-schema-fields');

var Message = ({ type, payload }) => ExactObject({
    properties: {
        type: { const: type },
        timezoneOffset: Integer({
            description: 'clients timezone offset',
        }),
        payload,
    },
    required: [
        'type',
        'timezoneOffset',
        'payload',
    ],
});

module.exports = Message;
