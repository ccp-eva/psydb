'use strict';
var inline = require('@cdxoo/inline-text'),
    systemPermissionsSchema = require('../../common/system-permissions-schema');

var {
    ExactObject,
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var PersonnelScientificState = () => {
    var schema = ExactObject({
        properties: {
            // TODO: figure out if there is personnel that isnt allowed
            // to login at all i.e. has no permissions na therefor
            // does not have a system-role

            hasRootAccess: {
                type: 'boolean',
                default: false
            },
            researchGroupSettings: {
                type: 'array',
                default: [],
                items: ExactObject({
                    properties: {
                        researchGroupId: ForeignId({
                            collection: 'researchGroup',
                        }),
                        systemRoleId: ForeignId({
                            collection: 'systemRole',
                        })
                    }
                })
            },

            systemPermissions: systemPermissionsSchema,
        },
        required: [
            'hasRootAccess',
            'researchGroupSettings',
            'systemPermissions',
        ],
    })

    return schema;
};

module.exports = PersonnelScientificState;
