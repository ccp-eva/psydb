'use strict';
var createFakeRootFlags = () => ({
    //canWriteAdministrativeCollections: true,
    canWritePersonnel: true,
    canSetPersonnelPassword: true,
    canUseExtendedSearch: true,
    canUseCSVExport: true,
    canCreateReservationsWithinTheNext3Days: true,
    canCreateExperimentsWithinTheNext3Days: true,


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
        [`canRemove${it}`]: true,
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
});

module.exports = { createFakeRootFlags };
