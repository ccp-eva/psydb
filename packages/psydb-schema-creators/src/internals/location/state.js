'use strict';
var inline = require('@cdxoo/inline-text'),
    CustomProps = require('../../common/custom-props'),
    systemPermissionsSchema = require('../../common/system-permissions-schema'),
    reservationSettingsSchema = require('./reservation-settings-schema');

var {
    ExactObject,
    FullText,
    ForeignId,
    DefaultArray,
    DateTime,
} = require('@mpieva/psydb-schema-fields');

var GenericLocationState = ({
    enableInternalProps,
    customFieldDefinitions,
} = {}) => {
    var schema = ExactObject({
        type: 'object',
        properties: {
            custom: CustomProps({ customFieldDefinitions }),
            reservationSettings: reservationSettingsSchema,
            systemPermissions: systemPermissionsSchema,
            comment: FullText({
                title: 'Kommentar',
            }),
            
            ...(enableInternalProps && {
                internals: Internals()
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

var Internals = () => ExactObject({
    properties: {},
    required: []
});

module.exports = GenericLocationState;
