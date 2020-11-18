'use strict';
var {
    id: InstituteId,
    baserecord: InstituteBaseRecord
} = require('../collections/institute/');

var id = 'psy-db/messages/update-institute-baserecord',
    ref = `${id}#`;

var schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    properties: {
        type: { const: 'update-institute-baserecord' },
        instituteId: InstituteId.ref,
        payload: InstituteBaseRecord.ref,
    },
    required: [
        'type',
        'instituteId',
        'payload',
    ]
}

module.exports = {
    id,
    ref,
    schema
}
