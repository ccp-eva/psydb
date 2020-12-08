'use strict';
var prefix = require('./schema-id-prefix'),
    systemPermissionsSchema = require('../system-permissions-schema'),
    reservationSettingsSchema = require('./reservation-settings-schema'),
    internalsSchema = require('./internals-schema');

var BuildingState = ({ subtype, customStateSchema }) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/building/${subtype}/state`,
        type: 'object',
        properties: {
            name: { type: 'string' },
            // some scientific buildings in the jungle might not have this
            //address: Address(),
            custom: customStateSchema,
            reservationSettings: reservationSettingsSchema,
            systemPermissions: systemPermissionsSchema,
            internals: internalsSchema,
        },
        required: [
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

module.exports = BuildingState;
