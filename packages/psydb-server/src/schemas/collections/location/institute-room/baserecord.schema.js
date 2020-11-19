'use strict';
var InstituteId = require('../institute/id.schema.js').ref,
    BuildingId = require('../institute-building/id.schema.js').ref,

var id = 'psy-db/location/baserecord-room',
    ref = { $ref: `${id}#` };

var InstituteRoom = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    properties: {
        type: { const: 'institute-room' },
        instituteId: InstituteId,
        instituteBuildingId: InstituteBuildingId,
        name: { type: 'string' },
        roomNumber: { type: 'string' },
        description: FullText,
        isHidden: { type: 'string' },
    },
    required: [
        'type',
        'instituteId',
        'instituteBuildingId',
        'name',
        'roomNumber',
    ],

};

module.exports = {
    id,
    ref,
    schema: Room,
}
