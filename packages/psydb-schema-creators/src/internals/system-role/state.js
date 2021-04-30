'use strict';
var inline = require('@cdxoo/inline-text');
    //CollectionPermission = require('./collection-permission'),
    //systemPermissionsSchema = require('../system-permissions-schema');

var {
    ExactObject,
    SaneString,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var SystemRoleState = ({
    //    schemaTree
} = {}) => {
    var schema = ExactObject({
        systemType: 'SystemRoleState',
        properties: {
            name: SaneString({
                title: 'Bezeichnung',
                minLength: 1,
            }),

            hasResearchGroupAdminAccess: DefaultBool({
                title: 'hat Forschungsgruppen-Administrator Berechtigungen',
                description: inline`
                    grants full access to database records of
                    the research groups the user belongs to;
                    also grants access to all functions that
                    related to those records
                `,
            }),

            // TODO decide if needed
            // from the ui/endpoint standpoint its basically the same as
            // "do you have any search permissions on that collection"
            // NOTE: RA can do that anyway
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

            canSelectSubjectsForExperiments: DefaultBool({
                title: 'kann Probanden für Experimente auswählen',
                description: inline`
                    when set enables the user to select subjects
                    for testing in certain studies; in this case
                    the individual field access permissions are
                    set by the study, not by the role
                    ("/search-for-testing" endpoint)
                    kinder => suchen => für ...
                `,
            }),

            canConfirmSubjectInvitation: DefaultBool({
                title: 'kann Probanden-Einladung bearbeiten/bestätigen',

                description: inline`
                    termine => bestaetigung
                    - "nicht erreicht"
                    - "anrufbeantworter"
                    - "bestätigt"
                    - kind austragen
                    - kind sperren
                    - termin verschieben
                `,

            }),

            canPostprocessExperiments: DefaultBool({
                title: 'kann Experimente nachbearbeiten',
                description: inline`
                    termine => nachbereitung,
                    - 'teilgenommen'
                    - 'erschienen ohne teilnahme'
                    - 'nicht erscheinen'
                    - 'abgesagt'
                    - 'ausgeladen'
                    ausserdem: 'kind bearbeiten' ... not sure
                    maybe research study + experiment id checken?
                `,
            }),
            // liste gruppiert nach experimenten
            // innerhalb dessen ne liste mit den probanden und
            // wo man auch den zustand setzen kann
            // | subject-label | sessionId | [ teilnahme ]
            // - dateilink
            // - dateilink

            canReserveLocations: DefaultBool({
                title: 'kann Test-Locations reservieren',
                description: inline``,
            }),

            canScheduleAwayTeams: DefaultBool({
                title: 'kann Aussen-Teams planen',
                description: inline``,
            }),

            canViewExternalExperimentsCalendar: DefaultBool({
                title: 'kann Aussen-Team-Kalender einsehen',
                description: inline`
                    termine => kigatermine
                    all research groups together?
                    might get crowded
                `,
            }),

            canViewInhouseExperimentsCalendar: DefaultBool({
                title: 'kann Inhouse-Kalender einsehen',
                description: inline`
                    termine => inhouse-termine
                    if we have only one research group omit dropdown in sidenav
                `,
            }),
            
            canViewInvitedSubjectSummaryCalendar: DefaultBool({
                title: 'kann Rezeptions-Kalender einsehen',
                description: inline`
                    reception view basically
                    of the user has only on element in the sidenav remove the side nav
                `,
            }),

            canWriteSubjects: DefaultBool({
                title: 'kann Probanden bearbeiten',
            }),

            canWriteStudies: DefaultBool({
                title: 'kann Studien bearbeiten', 
            }),

            canReadStudyCoreData: DefaultBool({
                title: 'kann Studien-Kerndaten lesen'
            }),

            canReadStudyParticipation: DefaultBool({
                title: 'kann Studienteilnahme einsehen',
            }),
            // a) via child name
            //     - search accessible studies
            //     - search in subject collections for subject with those
            //       studies in participatedIn
            // b) via study
            //     - search all children with that id in participatedIn
            // (participatedIn = (startDate, experiment, studyid, status))

            canWriteStudyParticipation: DefaultBool({
                title: 'kann Studienteilnahme manuell bearbeiten',
            })
            // hinzufügen, löschen
            

            /*collectionPermissions: {
                type: 'array',
                default: [],
                items: CollectionPermissions({ schemaTree }),
            },*/
            // only roles with hasRootAccess can access the roles
            //systemPermissions: systemPermissionsSchema,
        },
        required: [
            'hasResearchGroupAdminAccess',
            
            'canSelectSubjectsForExperiments',
            'canConfirmSubjectInvitation',
            'canPostprocessExperiments',
            'canReserveLocations',
            'canScheduleAwayTeams',

            'canViewExternalExperimentsCalendar',
            'canViewInhouseExperimentsCalendar',
            'canViewInvitedSubjectSummaryCalendar',
            
            'canWriteSubjects',
            'canWriteStudies',

            'canReadStudyCoreData',
            'canReadStudyParticipation',
            'canWriteStudyParticipation',
        ],
    });

    return schema;
};

module.exports = SystemRoleState;
