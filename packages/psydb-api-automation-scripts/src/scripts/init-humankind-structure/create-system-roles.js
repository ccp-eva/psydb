'use strict';

module.exports = async (context) => {
    var { driver, cache } = context;
    
    var { meta } = await driver.systemRole.create({
        name: 'Humankind RA', initial: true,
        override: []
    });
    cache.addId({ collection: 'systemRole', as: 'ra' });
 
    var { meta } = await driver.systemRole.create({
        name: 'Humankind Scientist', initial: false,
        override: [
            '/canReadStudies',
            '/canReadParticipation',
            '/canUseCSVExport',
            '/canViewStudyLabOpsSettings',

            '/labOperation/inhouse/canWriteReservations',
            '/labOperation/inhouse/canViewExperimentCalendar',

            '/labOperation/away-team/canWriteReservations',
            '/labOperation/away-team/canViewExperimentCalendar',

            '/labOperation/online-video-call/canWriteReservations',
            '/labOperation/online-video-call/canViewExperimentCalendar',
        ]
    });
    cache.addId({ collection: 'systemRole', as: 'scientist' });

    var { meta } = await driver.systemRole.create({
        name: 'Humankind Hiwi', initial: false,
        override: [
            '/canReadPersonnel',
            '/canReadStudies',
            '/canReadSubjects',
            '/canWriteSubjects',
            '/canReadParticipation',
            '/canViewStudyLabOpsSettings',

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
        ]
    });
    cache.addId({ collection: 'systemRole', as: 'hiwi' });
    
    var { meta } = await driver.systemRole.create({
        name: 'Humankind Reception', initial: false,
        override: [
            '/canViewReceptionCalendar',
        ]
    });
    cache.addId({ collection: 'systemRole', as: 'reception' });
    
    var { meta } = await driver.systemRole.create({
        name: 'Humankind Online Registration (ROBOT)', initial: false,
        override: [
            '/canReadHelperSets',
            '/canWriteSubjects',
        ]
    });
    cache.addId({ collection: 'systemRole', as: 'registration' });
}
