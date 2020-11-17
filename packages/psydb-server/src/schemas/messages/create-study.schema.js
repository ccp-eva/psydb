'use strict';
var {
    baserecord: StudyBaseRecord
} = require('../collections/study/');

var id = 'psy-db/messages/create-study',
    ref = `${id}#`;

var schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    properties: {
        type: { const: 'create-study' },
        payload: StudyBaseRecord.ref,
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
