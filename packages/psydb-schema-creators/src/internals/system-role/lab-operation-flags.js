'use strict';
var inline = require('@cdxoo/inline-text');
var { ExactObject, DefaultBool } = require('@mpieva/psydb-schema-fields');

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
        properties: {
            canWriteReservations: DefaultBool({
                title: {
                    'location-with-team': 'kann Räumlichkeiten reservieren',
                    'team-only': 'kann Experimenter-Teams planen',
                }[reservationType],
            }),
            canSelectSubjectsForExperiments: DefaultBool({
                title: 'kann Probanden für Termine auswählen',
            }),
            ...(hasInvitation && {
                canConfirmSubjectInvitation: DefaultBool({
                    title: 'kann Termine bestätigen',
                }),
            }),
            canViewExperimentCalendar: DefaultBool({
                title: 'kann Terminkalender einsehen',
            }),
            canMoveAndCancelExperiments: DefaultBool({
                title: 'kann Termine verschieben und absagen',
            }),
            canChangeOpsTeam: DefaultBool({
                title: 'kann Experimenter-Team ändern'
            }),
            canPostprocessExperiments: DefaultBool({
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
        properties: {
            canPerformOnlineSurveys: DefaultBool({
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
