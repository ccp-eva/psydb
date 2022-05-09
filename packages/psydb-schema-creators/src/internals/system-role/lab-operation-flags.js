'use strict';
var inline = require('@cdxoo/inline-text');
var { ExactObject, DefaultBool } = require('@mpieva/psydb-schema-fields');
var WideBool = require('./wide-bool');

var LabOperationPermissions = (options) => {
    var {
        title,
        hasInvitation,
        reservationType = 'location-with-team',
    } = options;

    if (!['location-with-team', 'team-only'].includes(reservationType)) {
        throw new Error('unknown reservation type');
    }

    return ExactObject({
        title,
        systemProps: { uiWrapper: 'InlineWrapper', uiHrTop: true },
        properties: {
            canWriteReservations: WideBool({
                title: {
                    'location-with-team': 'kann Räumlichkeiten reservieren',
                    'team-only': 'kann Experimenter:innen-Teams planen',
                }[reservationType],
            }),
            canSelectSubjectsForExperiments: WideBool({
                title: 'kann Probanden für Termine auswählen',
            }),
            ...(hasInvitation && {
                canConfirmSubjectInvitation: WideBool({
                    title: 'kann Termine bestätigen',
                }),
            }),
            canViewExperimentCalendar: WideBool({
                title: 'kann Terminkalender einsehen',
            }),
            canMoveAndCancelExperiments: WideBool({
                title: 'kann Termine verschieben und absagen',
            }),
            canChangeOpsTeam: WideBool({
                title: 'kann Experimenter:innen-Team ändern'
            }),
            canPostprocessExperiments: WideBool({
                title: 'kann Termine nachbearbeiten',
            }),
        },
        required: [
            'canWriteReservations',
            'canSelectSubjectsForExperiments',
            ...(hasInvitation ? [ 'canConfirmSubjectInvitation' ] : []),
            'canViewExperimentCalendar',
            'canMoveAndCancelExperiments',
            'canChangeOpsTeam',
            'canPostprocessExperiments',
        ]
    })
}

var SurveyPermissions = (options) => {
    var { title } = options;
    return ExactObject({
        title,
        systemProps: { uiWrapper: 'InlineWrapper', uiHrTop: true },
        properties: {
            canPerformOnlineSurveys: WideBool({
                title: 'kann Online-Umfragen durchführen'
            }),
        },
        required: [
            'canPerformOnlineSurveys'
        ]
    })
}

module.exports = {
    labOperation: ExactObject({
        properties: {
            'inhouse': LabOperationPermissions({
                title: 'Interne Termine',
                hasInvitation: true
            }),
            'away-team': LabOperationPermissions({
                title: 'Externe Termine',
                hasInvitation: false
            }),
            'online-video-call': LabOperationPermissions({
                title: 'Online-Video Termine',
                hasInvitation: true
            }),
            'online-survey': SurveyPermissions({
                title: 'Online-Umfragen',
            }),
        },
        required: [
            'inhouse',
            'away-team',
            'online-video-call',
            'online-survey',
        ]
    })
}
