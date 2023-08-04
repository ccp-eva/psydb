'use strict';
var inline = require('@cdxoo/inline-text'),
    systemPermissionsSchema = require('../../common/system-permissions-schema');

var {
    ExactObject,
    ForeignId,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var PersonnelScientificState = (bag) => {
    var { extraOptions = {} } = bag;
    var {
        enableCanLogIn = false,
        enableHasRootAccess = false,
    } = extraOptions;

    var schema = ExactObject({
        properties: {
            ...(enableCanLogIn && {
                canLogIn: DefaultBool({
                    title: 'Log-In erlauben'
                }),
            }),
            ...(enableHasRootAccess && {
                hasRootAccess: DefaultBool({
                    title: 'Admin-Zugriff',
                }),
            }),

            researchGroupSettings: {
                systemType: 'PersonnelResearchGroupSettingsList',
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
            ...(enableCanLogIn ? [ 'canLogIn' ] : []),
            ...(enableHasRootAccess ? [ 'hasRootAccess' ] : []),

            'researchGroupSettings',
            'systemPermissions',
        ],
    })

    return schema;
};

module.exports = PersonnelScientificState;
