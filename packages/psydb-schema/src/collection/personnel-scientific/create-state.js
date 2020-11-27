'use strict';
var inline = require('@cdxoo/inline-text'),
    prefix = require('./schema-id-prefix'),
    systemPermissionsSchema = require('../system-permissions-schema');

var {
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var createPersonnelScientificState = () => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/state`,
        type: 'object',
        properties: {
            // TODO: decide if that should be more than one
            //  => Yes just one as i decided the roles to be
            //  system wide and _not_ specific to the institute
            systemRoleId: ForeignId('systemRole'),
            belongsToInstituteIds: {
                type: 'array',
                default: [],
                items: ForeignId('institute'),
                description: inline`
                    items in this array enable the user to access
                    database records based on that records institute
                    related read/write permissions
                `,
            },
            systemPermissions: systemPermissionsSchema,
        },
        required: [
            'systemRoleId',
            'belongsToInstitute',
            'systemPermissions',
        ],
    }

    return schema;
};

module.exports = createPersonnelScientificState;
