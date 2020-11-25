'use strict';
var prefix = require('./schema-id-prefix'),
    systemPermissionsSchema = require('../system-permissions-schema'),
    reservationSettingsSchema = require('./reservation-settings-schema'),
    internalsSchema = require('./internals-schema');

var createBuildingState = (key, customInnerSchema) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/building/${key}/state`,
        type: 'object',
        properties: {
            type: { const: 'building' },
            subtype: { const: key },
            name: { type: 'string' },
            // some scientific buildings in the jungle might not have this
            //address: Address(),
            custom: customInnerSchema,
            reservationSettings: reservationSettingsSchema,
            systemPermissions: systemPermissionsSchema,
            internals: internalsSchema,
        },
        required: [
            'type',
            'subtype',
            'name',
            //'address',
            'custom',
            'reservationSettings',
            'systemPermissions',
            'internals',
        ]
    }

    return schema;
};

module.exports = createBuildingState;
