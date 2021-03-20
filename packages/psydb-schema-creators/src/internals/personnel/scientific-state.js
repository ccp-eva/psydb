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
            // TODO: decide if that should be more than one
            //  => Yes just one as i decided the roles to be
            //  system wide and _not_ specific to the institute
            // TODO: figure out if there is personnel that isnt allowed
            // to login at all i.e. has no permissions na therefor
            // does not have a system-role
            systemRoleId: ForeignId({
                collection: 'systemRole'
            }),
            // TODO: better version; implement before doing
            // actual permission work
            /*
            hasRootAccess: {
                type: 'boolean',
                default: false
            },
            researchGroups: {
                type: 'array',
                default: [],
                items: ExactObject({
                    properties: {
                        researchGroupId: ForeignId({
                            collection: 'researchGroup',
                        }),
                        systemRoleId: ForeignId({
                            collection:: 'systemRole',
                        })
                    }
                })
            },
            */
            researchGroupIds: {
                type: 'array',
                default: [],
                items: ForeignId({
                    collection: 'researchGroup'
                }),
                description: inline`
                    items in this array enable the user to access
                    database records based on that records research group
                    related read/write permissions
                `,
            },
            systemPermissions: systemPermissionsSchema,
        },
        required: [
            'systemRoleId',
            'researchGroupIds',
            'systemPermissions',
        ],
    })

    return schema;
};

module.exports = PersonnelScientificState;
