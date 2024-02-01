'use strict';

module.exports = async (context) => {
    var { apiKey, driver, cache, as } = context;

    await driver.sendMessage({
        type: 'systemRole/create',
        payload: { props: {
            name: 'Humankind RA',
            
            canReadLocations: true,
            canWriteLocations: true,
            canRemoveLocations: true,

            canReadExternalPersons: true,
            canWriteExternalPersons: true,
            canRemoveExternalPersons: true,

            canReadExternalOrganizations: true,
            canWriteExternalOrganizations: true,
            canRemoveExternalOrganizations: true,

            canReadStudyTopics: true,
            canWriteStudyTopics: true,
            canRemoveStudyTopics: true,

            canReadHelperSets: true,
            canWriteHelperSets: true,
            canRemoveHelperSets: true,

            canReadPersonnel: true,
            canWritePersonnel: true,
            canSetPersonnelPassword: true,
            
            canReadStudies: true,
            canWriteStudies: true,
            canRemoveStudies: true,

            canReadSubjects: true,
            canWriteSubjects: true,
            canRemoveSubjects: true,

            canReadParticipation: true,
            canWriteParticipation: true,

            canCreateReservationsWithinTheNext3Days: true,
            canCreateExperimentsWithinTheNext3Days: true,

            canUseExtendedSearch: true,
            canUseCSVExport: true,
            canViewReceptionCalendar: true,

            canAllowLogin: false,
            canViewStudyLabOpsSettings: true,
            canAccessSensitiveFields: true,

            labOperation: {
                'inhouse': {
                    canWriteReservations: true,
                    canSelectSubjectsForExperiments: true,
                    canConfirmSubjectInvitation: true,
                    canViewExperimentCalendar: true,
                    canMoveAndCancelExperiments: true,
                    canChangeOpsTeam: true,
                    canPostprocessExperiments: true,
                },
                'away-team': {
                    canWriteReservations: true,
                    canSelectSubjectsForExperiments: true,
                    canViewExperimentCalendar: true,
                    canMoveAndCancelExperiments: true,
                    canChangeOpsTeam: true,
                    canPostprocessExperiments: true,
                    canChangeExperimentStudy: true,
                    canRemoveExperimentSubject: true,
                },
                'online-video-call': {
                    canWriteReservations: true,
                    canSelectSubjectsForExperiments: true,
                    canConfirmSubjectInvitation: true,
                    canViewExperimentCalendar: true,
                    canMoveAndCancelExperiments: true,
                    canChangeOpsTeam: true,
                    canPostprocessExperiments: true,
                },
                'online-survey': {
                    canPerformOnlineSurveys: true,
                }
            }
        }}
    }, { apiKey });

    cache.addId({ collection: 'systemRole', as });
}
