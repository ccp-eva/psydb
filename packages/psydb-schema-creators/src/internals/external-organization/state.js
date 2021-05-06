'use strict';
var inline = require('@cdxoo/inline-text'),
    CustomProps = require('../../common/custom-props'),
    systemPermissionsSchema = require('../../common/system-permissions-schema');

var {
    ExactObject,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var ExternalOrganizationState = ({
    enableInternalProps,
    customFieldDefinitions,
} = {}) => {
    var schema = ExactObject({
        type: 'object',
        properties: {
            custom: CustomProps({ customFieldDefinitions }),
            systemPermissions: systemPermissionsSchema,
            
            ...(enableInternalProps && {
                /* TODO: anything here ? */
            })
        },
        required: [
            'custom',
            'systemPermissions',
            ...(
                enableInternalProps
                ? [ /* TODO anything here?*/]
                : []
            )
        ]
    })

    return schema;
};

module.exports = ExternalOrganizationState;
