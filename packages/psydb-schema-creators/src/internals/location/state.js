'use strict';
var inline = require('@cdxoo/inline-text'),
    CustomProps = require('../../common/custom-props'),
    systemPermissionsSchema = require('../../common/system-permissions-schema'),
    reservationSettingsSchema = require('./reservation-settings-schema');

var {
    ExactObject
} = require('@mpieva/psydb-schema-fields');

var GenericLocationState = ({
    customFieldDefinitions,
    enableInternalProps
} = {}) => {
    var schema = ExactObject({
        type: 'object',
        properties: {
            custom: CustomProps({ customFieldDefinitions }),
            reservationSettings: reservationSettingsSchema,
            systemPermissions: systemPermissionsSchema,
            
            ...(enableInternalProps && {
                /* TODO: anything here ? */
            })
        },
        required: [
            'custom',
            'reservationSettings',
            'systemPermissions',
            ...(
                enableInternalProps
                ? [ 'internals' ]
                : []
            )
        ]
    })

    return schema;
};

module.exports = GenericLocationState;
