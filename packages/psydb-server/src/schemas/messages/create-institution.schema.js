'use strict';
var {
    baserecord: InstitutionBaseRecord
} = require('../collections/institution/');

var id = 'psy-db/messages/create-institution',
    ref = `${id}#`;

var schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    properties: {
        type: { const: 'create-institution' },
        payload: InstitutionBaseRecord.ref,
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
