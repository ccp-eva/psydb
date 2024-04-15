'use strict';

module.exports = async (context) => {
    var { apiKey, driver, cache, as } = context;

    await driver.sendMessage({
        type: 'systemRole/create',
        payload: { props: {
            name: 'WKPRC Scientist',

            canReadLocations: true,
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
            canAllowLogin: false,
            canSetPersonnelPassword: false,
            
            canReadStudies: true,
            canWriteStudies: false,
            canRemoveStudies: false,
            canViewStudyLabOpsSettings: false,

            canReadSubjects: true,
            canWriteSubjects: false,
            canRemoveSubjects: false,

            canReadSubjectGroups: false,
            canWriteSubjectGroups: false,
            canRemoveSubjectGroups: false,

            canReadParticipation: true,
            canWriteParticipation: true,

            canCreateReservationsWithinTheNext3Days: false,
            canCreateExperimentsWithinTheNext3Days: false,

            canUseExtendedSearch: false,
            canUseCSVExport: false,
            canViewReceptionCalendar: false,
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
