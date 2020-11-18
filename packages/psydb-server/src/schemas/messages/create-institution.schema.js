'use strict';
var {
    baserecord: InstituteBaseRecord
} = require('../collections/institute/');

var id = 'psy-db/messages/create-institute',
    ref = `${id}#`;

var schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    properties: {
        type: { const: 'create-institute' },
        payload: InstituteBaseRecord.ref,
    },
    required: [
        'type',
        'payload',
    ]
}

module.exports = {
    id,
    ref,
    schema
}
