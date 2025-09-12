'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { Fields } = require('../utils');

var fakeRecord = (bag) => {
    var { refcache } = bag;

    var flagpointers = [
        '/canReadLocations',
        '/canWriteLocations',
        '/canRemoveLocations',

        '/canReadExternalPersons',
        '/canWriteExternalPersons',
        '/canRemoveExternalPersons',

        '/canReadExternalOrganizations',
        '/canWriteExternalOrganizations',
        '/canRemoveExternalOrganizations',

        '/canReadStudyTopics',
        '/canWriteStudyTopics',
        '/canRemoveStudyTopics',

        '/canReadHelperSets',
        '/canWriteHelperSets',
        '/canRemoveHelperSets',

        '/canReadPersonnel',
        '/canWritePersonnel',
        '/canAllowLogin',
        '/canSetPersonnelPassword',
        
        '/canReadStudies',
        '/canWriteStudies',
        '/canRemoveStudies',
        '/canViewStudyLabOpsSettings',

        '/canReadSubjects',
        '/canWriteSubjects',
        '/canRemoveSubjects',

        '/canReadSubjectGroups',
        '/canWriteSubjectGroups',
        '/canRemoveSubjectGroups',

        '/canReadParticipation',
        '/canWriteParticipation',

        '/canCreateReservationsWithinTheNext3Days',
        '/canCreateExperimentsWithinTheNext3Days',

        '/canUseExtendedSearch',
        '/canUseCSVExport',
        '/canViewReceptionCalendar',
        '/canAccessSensitiveFields',
        
        ...([
            'canWriteReservations',
            'canSelectSubjectsForExperiments',
            'canConfirmSubjectInvitation',
            'canViewExperimentCalendar',
            'canMoveAndCancelExperiments',
            'canChangeOpsTeam',
            'canPostprocessExperiments',
        ].map(it => `/labOperation/inhouse/${it}`)),

        ...([
            'canWriteReservations',
            'canSelectSubjectsForExperiments',
            'canViewExperimentCalendar',
            'canMoveAndCancelExperiments',
            'canChangeOpsTeam',
            'canPostprocessExperiments',
            'canChangeExperimentStudy',
            'canRemoveExperimentSubject',
        ].map(it => `/labOperation/away-team/${it}`)),

        ...([
            'canWriteReservations',
            'canSelectSubjectsForExperiments',
            'canConfirmSubjectInvitation',
            'canViewExperimentCalendar',
            'canMoveAndCancelExperiments',
            'canChangeOpsTeam',
            'canPostprocessExperiments',
        ].map(it => `/labOperation/online-video-call/${it}`)),

        ...([
            'canPerformOnlineSurveys',
        ].map(it => `/labOperation/online-survey/${it}`)),
    
    ];

    var flags = {};
    for (var ptr of flagpointers) {
        jsonpointer.set(flags, ptr, Fields.DefaultBool());
    }

    var record = {
        'state': {
            'name': Fields.SaneString({ minLength: 1 }),
            ...flags
        }
    }

    return record;
}

module.exports = fakeRecord;
