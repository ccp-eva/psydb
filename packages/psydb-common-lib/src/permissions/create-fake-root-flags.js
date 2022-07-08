'use strict';
var createFakeRootFlags = () => ({
    //canWriteAdministrativeCollections: true,
    canWritePersonnel: true,
    canSetPersonnelPassword: true,

    ...([
        'Subjects',
        'Studies',
        'Locations',
        'ExternalPersons',
        'ExternalOrganizations',
        'StudyTopics',
        'HelperSets',
        'Personnel'
    ]).reduce((acc, it) => ({
        ...acc,
        [`canRead${it}`]: true,
        [`canWrite${it}`]: true,
    }), {}),

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
