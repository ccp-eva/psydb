'use strict';
var inline = require('@cdxoo/inline-text');
    //CollectionPermission = require('./collection-permission'),
    //systemPermissionsSchema = require('../system-permissions-schema');

var {
    ExactObject,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var SystemRoleState = ({
    //    schemaTree
} = {}) => {
    var schema = ExactObject({
        type: 'object',
        properties: {
            name: SaneString(),
            // FIXME: im not sure that i need that
            // since system-role only makes sense when the user can login
            /*canSignIn: {
                type: 'boolean',
                default: false,
                description: inline`
                    when set enables the system sign in
                    via primary email and password
                `,
            },*/
            hasRootAccess: {
                type: 'boolean',
                default: false,
                description: inline`
                    grants full access to all database records and
                    functions regardless of institute;
                    should only used for system-administrator role
                `,
            },
            hasResearchGroupAdminAccess: {
                type: 'boolean',
                default: false,
                description: inline`
                    grants full access to database records of
                    the research groups the user belongs to;
                    also grants access to all functions that
                    related to those records
                `,
            },

            // TODO decide if needed
            // from the ui/endpoint standpoint its basically the same as
            // "do you have any search permissions on that collection"
            /*canSearchArbitrarySubjects: {
                type: 'boolean',
                default: false,
                description: inline`
                    when set enables the user to use the arbitrary
                    subject search; this search can find any subject
                    in the database with at least read rights for
                    the users institute i.e. its outside of subject
                    selection for a study; in this case the field
                    permissions of the role are applied
                    ("/search" endpoint)
                `,
            },*/

            canSelectSubjectsForTesting: {
                type: 'boolean',
                default: false,
                description: inline`
                    when set enables the user to select subjects
                    for testing in certain studies; in this case
                    the individual field access permissions are
                    set by the study, not by the role
                    ("/search-for-testing" endpoint)
                    kinder => suchen => für ...
                `,
            },

            canAccessStudySummary: {
                type: 'boolean',
                default: false,
                description: inline`
                    suche => studie => summary button
                `,
            },

            canAccessLocationReservations: {
                type: 'boolean',
                default: false,
                description: inline`
                    termine => bestellung
                `,
            },

            canAccessExternalExperimentsCalendar: {
                type: 'boolean',
                default: false,
                description: inline`
                    termine => kigatermine
                    all research groups together?
                    might get crowded
                `,
            },

            canAccessInhouseExperimentsCalendar: {
                type: 'boolean',
                default: false,
                description: inline`
                    termine => inhouse-termine
                    if we have only one research group omit dropdown in sidenav
                `,
            },

            canViewInvitedSubjectSummaryCalendar: {
                type: 'boolean',
                default: false,
                description: inline`
                    reception view basically
                    of the user has only on element in the sidenav remove the side nav
                `,
            },
            /*collectionPermissions: {
                type: 'array',
                default: [],
                items: CollectionPermissions({ schemaTree }),
            },*/
            // only roles with hasRootAccess can access the roles
            //systemPermissions: systemPermissionsSchema,
        },
        required: [
            'hasRootAccess',
            'hasResearchGroupAdminAccess',
            //'canSearchArbitrarySubjects',
            'canSelectSubjectsForTesting',
            'canAccessStudySummary',
            'canAccessLocationReservations',
            'canAccessExternalExperimentsCalendar',
            'canAccessInhouseExperimentsCalendar',
            'canViewInvitedSubjectSummaryCalendar',
            //'collectionPermissions',
            //'systemPermissions',
        ],
    });

    return schema;
};

module.exports = SystemRoleState;
