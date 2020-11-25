'use strict';
var prefix = require('./schema-id-prefix'),
    systemPermissionsSchema = require('../system-permissions-schema'),
    reservationSettingsSchema = require('./reservation-settings-schema'),
    internalsSchema = require('./internals-schema');

var {
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var createRoomState = (key, customInnerSchema) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/room/${key}/state`,
        type: 'object',
        properties: {
            type: { const: 'room' },
            subtype: { const: key },
            buildingId: ForeignId('location', { type: 'building' }),
            name: { type: 'string' },
            custom: customInnerSchema,
            reservationSettings: reservationSettingsSchema,
            systemPermissions: systemPermissionsSchema,
            internals: internalsSchema,
        },
        required: [
            'type',
            'subtype',
            'name',
            'buildingId',
            'custom',
            'reservationSettings',
            'systemPermissions',
            'internals',
        ]
    };

    return schema;
};

module.exports = createRoomState;
