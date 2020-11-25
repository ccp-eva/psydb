'use strict';
var prefix = require('./schema-id-prefix'),
    systemPermissionsSchema = require('../system-permissions-schema'),
    reservationSettingsSchema = require('./reservation-settings-schema'),
    internalsSchema = require('./internals-schema');

var createGenericLocationState = (key, customInnerSchema) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/${key}/state`,
        type: 'object',
        properties: {
            type: { const: key },
            name: { type: 'string' },
            custom: customInnerSchema,
            reservationSettings: reservationSettingsSchema,
            systemPermissions: systemPermissionsSchema,
            internals: internalsSchema,
        },
        required: [
            'type',
            'name',
            'custom',
            'reservationSettings',
            'systemPermissions',
            'internals',
        ]
    }

    return schema;
};

module.exports = createGenericLocationState;
