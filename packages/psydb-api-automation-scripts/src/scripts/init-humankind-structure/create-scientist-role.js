'use strict';

module.exports = async (context) => {
    var { apiKey, driver, cache, as } = context;

    await driver.sendMessage({
        type: 'systemRole/create',
        payload: { props: {
            name: 'ChildLab Scientist',
            
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

            canReadPersonnel: false,
            canWritePersonnel: false,
            canSetPersonnelPassword: false,
            
            canReadStudies: true,
            canWriteStudies: false,
            canRemoveStudies: false,

            canReadSubjects: false,
            canWriteSubjects: false,
            canRemoveSubjects: false,

            canReadParticipation: true,
            canWriteParticipation: false,

            canCreateReservationsWithinTheNext3Days: false,
            canCreateExperimentsWithinTheNext3Days: false,

            canUseExtendedSearch: false,
            canUseCSVExport: true,
            canViewReceptionCalendar: false,

            canAllowLogin: false,
            canViewStudyLabOpsSettings: true,
            canAccessSensitiveFields: false,

            labOperation: {
                'inhouse': {
                    canWriteReservations: true,
                    canSelectSubjectsForExperiments: false,
                    canConfirmSubjectInvitation: false,
                    canViewExperimentCalendar: true,
                    canMoveAndCancelExperiments: false,
                    canChangeOpsTeam: false,
                    canPostprocessExperiments: false,
                },
                'away-team': {
                    canWriteReservations: true,
                    canSelectSubjectsForExperiments: false,
                    canViewExperimentCalendar: true,
                    canMoveAndCancelExperiments: false,
                    canChangeOpsTeam: false,
                    canPostprocessExperiments: false,
                    canChangeExperimentStudy: false,
                    canRemoveExperimentSubject: false,
                },
                'online-video-call': {
                    canWriteReservations: true,
                    canSelectSubjectsForExperiments: false,
                    canConfirmSubjectInvitation: false,
                    canViewExperimentCalendar: true,
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
