'use strict';
var {
    id: InstitutionId,
    baserecord: InstitutionBaseRecord
} = require('../collections/institution/');

var id = 'psy-db/messages/update-institution-baserecord',
    ref = `${id}#`;

var schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    properties: {
        type: { const: 'update-institution-baserecord' },
        institutionId: InstitutionId.ref,
        payload: InstitutionBaseRecord.ref,
    },
    required: [
        'type',
        'institutionId',
        'payload',
    ]
}

module.exports = {
    id,
    ref,
    schema
}
