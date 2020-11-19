'use strict';
var id = 'psy-db/location/baserecord-gps',
    ref = { $ref: `${id}#` };

var GPS = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    properties: {
        type: { const: 'gps' },
        subtype: { enum: [
            // just so that we can add more later
            'default'
        ]},
        name: { type: 'string' },
        latitute: {
            type: 'number',
            minimum: -90,
            maximum: 90,
        },
        longitute: {
            type: 'number',
            minimum: -180,
            maximum: 180,
        },
    },
    required: [
        'type',
        'subtype',
        'name',
        'latitute',
        'longitude',
    ]
}

module.exports = {
    id,
    ref,
    schema: Room,
}
