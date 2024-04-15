'use strict';

module.exports = async (context) => {
    var { apiKey, driver, cache, as } = context;

    await driver.sendMessage({
        type: 'systemRole/create',
        payload: { props: {
            name: 'WKPRC RA',

            canReadLocations: true,
            canWriteLocations: true,
            canRemoveLocations: true,

            canReadExternalPersons: false,
            canWriteExternalPersons: false,
            canRemoveExternalPersons: false,

            canReadExternalOrganizations: false,
            canWriteExternalOrganizations: false,
            canRemoveExternalOrganizations: false,

            canReadStudyTopics: true,
            canWriteStudyTopics: true,
            canRemoveStudyTopics: true,

            canReadHelperSets: true,
            canWriteHelperSets: true,
            canRemoveHelperSets: true,

            canReadPersonnel: true,
            canWritePersonnel: true,
            canAllowLogin: true,
            canSetPersonnelPassword: false,
            
            canReadStudies: true,
            canWriteStudies: true,
            canRemoveStudies: true,
            canViewStudyLabOpsSettings: true,

            canReadSubjects: true,
            canWriteSubjects: true,
            canRemoveSubjects: true,

            canReadSubjectGroups: true,
            canWriteSubjectGroups: true,
            canRemoveSubjectGroups: true,

            canReadParticipation: true,
            canWriteParticipation: true,

            canCreateReservationsWithinTheNext3Days: false,
            canCreateExperimentsWithinTheNext3Days: false,

            canUseExtendedSearch: true,
            canUseCSVExport: true,
            canViewReceptionCalendar: false,
            canAccessSensitiveFields: true,
            
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
