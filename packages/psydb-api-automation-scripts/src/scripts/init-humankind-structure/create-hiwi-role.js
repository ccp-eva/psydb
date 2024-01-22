'use strict';

module.exports = async (context) => {
    var { apiKey, driver, cache, as } = context;

    await driver.sendMessage({
        type: 'systemRole/create',
        payload: { props: {
            name: 'Humankind Hiwi',
            
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

            canReadHelperSets: false,
            canWriteHelperSets: false,
            canRemoveHelperSets: false,

            canReadPersonnel: true,
            canWritePersonnel: false,
            canSetPersonnelPassword: false,
            
            canReadStudies: true,
            canWriteStudies: false,
            canRemoveStudies: false,

            canReadSubjects: true,
            canWriteSubjects: true,
            canRemoveSubjects: false,

            canReadParticipation: true,
            canWriteParticipation: false,

            canCreateReservationsWithinTheNext3Days: false,
            canCreateExperimentsWithinTheNext3Days: false,

            canUseExtendedSearch: false,
            canUseCSVExport: false,
            canViewReceptionCalendar: false,

            canAllowLogin: false,
            canViewStudyLabOpsSettings: true,
            canAccessSensitiveFields: false,

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
                    canChangeExperimentStudy: false,
                    canRemoveExperimentSubject: false,
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
                    canPerformOnlineSurveys: false,
                }
            }
        }}
    }, { apiKey });

    cache.addId({ collection: 'systemRole', as });
}
