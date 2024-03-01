'use strict';

module.exports = async (context) => {
    var { apiKey, driver, cache, as } = context;

    await driver.sendMessage({
        type: 'systemRole/create',
        payload: { props: {
            name: 'Humankind Online Registration (ROBOT)',
            
            canReadLocations: false,
            canWriteLocations: false,
            canRemoveLocations: false,

            canReadExternalPersons: false,
            canWriteExternalPersons: false,
            canRemoveExternalPersons: false,

            canReadExternalOrganizations: false,
            canWriteExternalOrganizations: false,
            canRemoveExternalOrganizations: false,

            canReadStudyTopics: false,
            canWriteStudyTopics: false,
            canRemoveStudyTopics: false,

            canReadHelperSets: true,
            canWriteHelperSets: false,
            canRemoveHelperSets: false,

            canReadPersonnel: false,
            canWritePersonnel: false,
            canSetPersonnelPassword: false,
            
            canReadStudies: false,
            canWriteStudies: false,
            canRemoveStudies: false,

            canReadSubjects: false,
            canWriteSubjects: true,
            canRemoveSubjects: false,

            canReadParticipation: false,
            canWriteParticipation: false,

            canCreateReservationsWithinTheNext3Days: false,
            canCreateExperimentsWithinTheNext3Days: false,

            canUseExtendedSearch: false,
            canUseCSVExport: false,
            canViewReceptionCalendar: false,

            canAllowLogin: false,
            canViewStudyLabOpsSettings: false,
            canAccessSensitiveFields: false,

            labOperation: {
                'inhouse': {
                    canWriteReservations: false,
                    canSelectSubjectsForExperiments: false,
                    canConfirmSubjectInvitation: false,
                    canViewExperimentCalendar: false,
                    canMoveAndCancelExperiments: false,
                    canChangeOpsTeam: false,
                    canPostprocessExperiments: false,
                },
                'away-team': {
                    canWriteReservations: false,
                    canSelectSubjectsForExperiments: false,
                    canViewExperimentCalendar: false,
                    canMoveAndCancelExperiments: false,
                    canChangeOpsTeam: false,
                    canPostprocessExperiments: false,
                    canChangeExperimentStudy: false,
                    canRemoveExperimentSubject: false,
                },
                'online-video-call': {
                    canWriteReservations: false,
                    canSelectSubjectsForExperiments: false,
                    canConfirmSubjectInvitation: false,
                    canViewExperimentCalendar: false,
                    canMoveAndCancelExperiments: false,
                    canChangeOpsTeam: false,
                    canPostprocessExperiments: false,
                },
                'online-survey': {
                    canPerformOnlineSurveys: false,
                }
            }
        }}
    }, { apiKey });

    cache.addId({ collection: 'systemRole', as });
}
