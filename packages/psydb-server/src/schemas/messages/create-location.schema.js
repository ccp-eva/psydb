'use strict';
var {
    baserecord: LocationBaseRecord
} = require('../collections/location/');

var id = 'psy-db/messages/create-location',
    ref = `${id}#`;

var schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    properties: {
        type: { const: 'create-location' },
        payload: LocationBaseRecord.ref,
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
