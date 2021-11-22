'use strict';
var createFakeRootFlags = () => ({
    canWriteAdministrativeCollections: true,
    canWritePersonnel: true,
    canSetPersonnelPassword: true,

    canReadStudies: true,
    canWriteStudies: true,
    canReadSubjects: true,
    canWriteSubjects: true,

    canReadParticipation: true,
    canWriteParticipation: true,

    canViewReceptionCalendar: true,

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
});

module.exports = { createFakeRootFlags };
