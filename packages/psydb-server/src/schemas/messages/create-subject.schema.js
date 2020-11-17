'use strict';
var {
    baserecord: SubjectScientificBaseRecord
} = require('../collections/subject-scientific/');

var {
    baserecord: SubjectGDPRBaseRecord
} = require('../collections/subject-gdpr/');

var id = 'psy-db/messages/create-location',
    ref = `${id}#`;

var schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    properties: {
        type: { const: 'create-subject' },
        payload: {
            type: 'object',
            properties: {
                scientific: SubjectSientificBaseRecord.ref,
                gdpr: SubjectGDPRBaseRecord.ref,
            },
            required: [
                'scientific',
                'gdpr',
            ],
        }
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
