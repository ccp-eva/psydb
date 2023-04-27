'use strict';

var createFSScientistRole = async ({ apiKey, driver, site }) => {
    await driver.sendMessage({
        type: 'systemRole/create',
        payload: { props: {
            name: 'FS Scientist',
            canWritePersonnel: false,
            canSetPersonnelPassword: false,
            
            canUseExtendedSearch: true,
            canUseCSVExport: true,
            canCreateReservationsWithinTheNext3Days: false,
            canCreateExperimentsWithinTheNext3Days: false,

            canReadSubjects: true,
            canWriteSubjects: true,
            canRemoveSubjects: true,

            canReadStudies: true,
            canWriteStudies: false,
            canRemoveStudies: false,

            canReadLocations: true,
            canWriteLocations: true,
            canRemoveLocations: true,

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
            canWriteHelperSets: true,
            canRemoveHelperSets: true,

            canReadParticipation: true,
            canWriteParticipation: true,

            canViewReceptionCalendar: false,

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

    return driver.getCache().lastChannelIds['systemRole'];
}

module.exports = createFSScientistRole;



