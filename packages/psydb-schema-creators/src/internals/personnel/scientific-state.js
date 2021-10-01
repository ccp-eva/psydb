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
                title: 'Admin-Zugriff',
                type: 'boolean',
                default: false
            },
            researchGroupSettings: {
                title: 'Forschungsgruppen',
                type: 'array',
                default: [],
                items: ExactObject({
                    properties: {
                        researchGroupId: ForeignId({
                            title: 'Gruppe',
                            collection: 'researchGroup',
                        }),
                        systemRoleId: ForeignId({
                            title: 'Zugriff',
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
