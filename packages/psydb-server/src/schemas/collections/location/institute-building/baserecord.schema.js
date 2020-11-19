'use strict';
var Address = require('../../fields/address').ref,
    BlockedWeekdays = require('../../fields/blocked-weekdays').ref,
    FullText = require('../../fields/full-text').ref;

var id = 'psy-db/location/external-building/baserecord',
    ref = { $ref: `${id}#` };

var InstituteBuilding = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    properties: {
        type: { const: 'institute-building' },
        name: { type: 'string' },
        instituteId: instituteId,
        address: Address,

        description: FullText,
        isHidden: { type: 'boolean' },
    },
    required: [
        'type',
        'name',
        'instituteId',
        'address',
    ],
}

module.exports = {
    id,
    ref,
    schema: InstituteBuilding,
}
