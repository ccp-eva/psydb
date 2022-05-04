'use strict';
var inline = require('@cdxoo/inline-text'),
    systemPermissionsSchema = require('../../common/system-permissions-schema');

var {
    ExactObject,
    ForeignId,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var PersonnelScientificState = () => {
    var schema = ExactObject({
        properties: {
            canLogIn: DefaultBool({
                title: 'Log-In erlauben'
            }),
            hasRootAccess: DefaultBool({
                title: 'Admin-Zugriff',
            }),
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
                    },
                    required: [
                        'researchGroupId',
                        'systemRoleId'
                    ]
                })
            },

            systemPermissions: systemPermissionsSchema,
            internals: ExactObject({
                properties: {
                    forcedResearchGroup: ForeignId({
                        collection: 'researchGroup'
                    })
                }
            }),
        },
        required: [
            'canLogIn',
            'hasRootAccess',
            'researchGroupSettings',
            'systemPermissions',
        ],
    })

    return schema;
};

module.exports = PersonnelScientificState;
