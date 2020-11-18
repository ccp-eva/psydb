'use strict';
var Address = require('../../compound-fields/address').ref;

var conditional = (ifProps, thenSchema) => ({
    if: { properties: ifProps },
    then: thenSchema
});

var ifType = (ifType, thenSchema) => (
    conditional({ type: { const: ifType }}, thenSchema)
);

var ifSubType = (ifSubType, thenSchema) => (
    conditional({ subtype: { const: ifSubType }}, thenSchema)
);


var id = 'psy-db/lcation/baserecord',
    ref = { $ref: `${id}#` };

var Room = {
    type: 'object',
    properties: {
        type: { const: 'room' },
        subtype: { enum: [
            'institute-room',
            'other',
        ]},
        buildingId: BuildingId,
        name: { type: 'string' },
        roomNumber: { type: 'string' },
        description: { type: 'string' },
        isHidden: { type: 'string' },
    },
    required: [
        'type',
        'subtype',
        'instituteId',
        'buildingId',
        'name',
        'roomNumber',
    ],

    ...ifSubType('institite-room', {
        properties: {
            instituteId: InstituteId,
        },
        required: [
            'instituteId',
        ]
    });

};

var Building = {
    type: 'object',
    properties: {
        type: { const: 'building' },
        subtype: { enum: [
            'institute-building',
            'kindergarden',
        ]},
        name: { type: 'string' },
        address: Address,
        isHidden: { type: 'string' },
    },
    required: [
        'type',
        'subtype',
    ],

    ...ifSubType('institite-building', {
        properties: {
            instituteId: InstituteId,
        },
        required: [
            'instituteId',
        ]
    });

}

var GPS = {
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

var schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    oneOf: [
        Building,
        Room,
        GPS,
    ]
}

// external/institute-internal
// subtypes = kindergarden, school, etc

// TODO: variant list to creat defaults

module.exports = {
    id,
    ref,
    schema,
}
