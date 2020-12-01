'use strict';
var inline = require('@cdxoo/inline-text'),
    prefix = require('./schema-id-prefix'),
    CollectionPermission = require('./collection-permission'),
    systemPermissionsSchema = require('../system-permissions-schema'),

var {
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var createSystemRoleState = ({
    schemaTree
}) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/state`,
        type: 'object',
        properties: {
            canSignIn: {
                type: 'bool',
                default: false,
                description: inline`
                    when set enables the system sign in
                    via primary email and password
                `,
            },
            hasRootAccess: {
                type: 'bool',
                default: false,
                description: inline`
                    grants full access to all database records and
                    functions regardless of institute;
                    should only used for system-administrator role
                `,
            },
            // TODO decide if needed
            // from the ui/endpoint standpoint its basically the same as
            // "do you have any search permissions on that collection"
            canSearchArbitrarySubjects: {
                type: 'bool',
                default: false,
                description: inline`
                    when set enables the user to use the arbitrary
                    subject search; this search can find any subject
                    in the database with at least read rights for
                    the users institute i.e. its outside of subject
                    selection for a study; in this case the field
                    permissions of the role are applied
                `,
            },
            canSelectSubjectsForTesting: {
                type: 'bool',
                default: false,
                description: inline`
                    when set enables the user to select subjects
                    for testing in certain studies; in this case
                    the individual field access permissions are
                    set by the study, not by the role
                `,
            },
            canViewLocationRservations: {
                type: 'bool',
                defualt: false,
            },
            collectionPermissions: {
                type: 'array',
                default: [],
                items: CollectionPermissions({ schemaTree }),
            },
            systemPermissions: systemPermissionsSchema,
        },
        required: [
            'hasRootAccess',
            'canSearchArbitrarySubjects',
            'canSelectSubjectsForTesting',
            'collectionPermissions',
            'systemPermissions',
        ],
    }

    return schema;
};

module.exports = createSystemRoleState;
