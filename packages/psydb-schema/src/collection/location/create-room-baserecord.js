'use strict';
var ForeignKey = require('../../foreign-key'),
    prefix = require('./schema-id-prefix');

var createRoomBaseRecord = (key, customInnerSchema) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/room/${key}/baserecord`,
        allOf: [
            {
                type: 'object',
                properties: {
                    type: { const: 'room' },
                    subtype: { const: key },
                    name: { type: 'string' },
                    buildingId: ForeignKey('location', { type: 'building' }),
                },
                required: [
                    'type',
                    'subtype',
                    'name',
                    'buildingId',
                ]
            },
            customInnerSchema,
        ]
    } 
};

module.exports = createRoomBaseRecord;
