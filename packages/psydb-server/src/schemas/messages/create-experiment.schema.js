'use strict';
var {
    baserecord: ExperimentBaseRecord
} = require('../collections/experiment/');

var id = 'psy-db/messages/create-experiment',
    ref = `${id}#`;

var schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    properties: {
        type: { const: 'create-experiment' },
        payload: ExperimentBaseRecord.ref,
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
