'use strict';
var prefix = require('./schema-id-prefix'),
    systemPermissionsSchema = require('../system-permissions-schema'),
    reservationSettingsSchema = require('./reservation-settings-schema'),
    internalsSchema = require('./internals-schema');

var {
    ExactObject
} = require('@mpieva/psydb-schema-fields');

var GenericLocationState = ({ type, customStateSchema }) => {
    var schema = ExactObject({
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/${type}/state`,
        type: 'object',
        properties: {
            custom: customStateSchema,
            reservationSettings: reservationSettingsSchema,
            systemPermissions: systemPermissionsSchema,
            internals: internalsSchema,
        },
        required: [
            'custom',
            'reservationSettings',
            'systemPermissions',
            'internals',
        ]
    })

    return schema;
};

module.exports = GenericLocationState;
