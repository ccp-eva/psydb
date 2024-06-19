'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');

var create = async (bag) => {
    var { driver, name, initial = false, override = [] } = bag;
    var overrideValue = !initial;

    var flagProps = {};
    setValues(flagProps, [
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
    
    ], initial);

    setValues(flagProps, override, overrideValue);

    await driver.sendMessage({
        type: 'systemRole/create',
        payload: { props: {
            name, ...flagProps
        }},
    });
    
    var roleId = driver.getCache().lastChannelIds['systemRole'];

    return {
        meta: { _id: roleId }
    }
}

var setValues = (onThat, pointers, value) => {
    for (var it of pointers) {
        jsonpointer.set(onThat, it, value);
    }
}

module.exports = create;
