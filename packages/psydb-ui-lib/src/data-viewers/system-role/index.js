import React from 'react';
import camelcase from 'camelcase';
import { createBase, withPair, addComponents } from '../core';
import {
    SaneString,
    FullText,
    DefaultBool,
} from '../utility-components';

const cc = (str) => camelcase(str, {
    pascalCase: true,
    preserveConsecutiveUppercase: true
})

const labOpsPath = (type, flag) => (
    `/state/labOperation/${type}/${flag}`
)

const inviteLabOpsLabels = (type) => ({
    [labOpsPath(type, 'canWriteReservations')]: (
        'kann Räumlichkeiten reservieren'
    ),
    [labOpsPath(type, 'canSelectSubjectsForExperiments')]: (
        'kann Proband:innen für Termine auswählen'
    ),
    [labOpsPath(type, 'canConfirmSubjectInvitation')]: (
        'kann Termine bestätigen'
    ),
    [labOpsPath(type, 'canViewExperimentCalendar')]: (
        'kann Terminkalender einsehen'
    ),
    [labOpsPath(type, 'canMoveAndCancelExperiments')]: (
        'kann Termine verschieben und absagen'
    ),
    [labOpsPath(type, 'canChangeOpsTeam')]: (
        'kann Experimenter:innen-Teams ändern'
    ),
    [labOpsPath(type, 'canPostprocessExperiments')]: (
        'kann Termine nachbereiten'
    ),
})

const awayTeamLabOpsLabels = (type) => ({
    [labOpsPath(type, 'canWriteReservations')]: (
        'kann Experimenter:innen-Teams planen'
    ),
    [labOpsPath(type, 'canSelectSubjectsForExperiments')]: (
        'kann Proband:innen für Termine auswählen'
    ),
    [labOpsPath(type, 'canViewExperimentCalendar')]: (
        'kann Terminkalender einsehen'
    ),
    [labOpsPath(type, 'canMoveAndCancelExperiments')]: (
        'kann Termine verschieben und absagen'
    ),
    [labOpsPath(type, 'canChangeOpsTeam')]: (
        'kann Experimenter:innen-Teams ändern'
    ),
    [labOpsPath(type, 'canPostprocessExperiments')]: (
        'kann Termine nachbereiten'
    ),
    [labOpsPath(type, 'canChangeExperimentStudy')]: (
        'kann Studie von existierenden Terminen ändern'
    ),
    [labOpsPath(type, 'canRemoveExperimentSubject')]: (
        'kann Proband:innen aus existierenden Terminen entfernen'
    ),
});

const surveyLabOpsLabels = (type) => ({
    [labOpsPath(type, 'canPerformOnlineSurveys')]: (
        'kann Online-Umfragen durchführen'
    ),
})

const labels = {
    '/sequenceNumber': 'ID Nr.',
    '/state/name': 'Bezeichnung',

    '/state/canReadLocations': (
        'kann Locations einsehen (Kigas, Räume, etc.)'
    ),
    '/state/canWriteLocations': (
        'kann Locations bearbeiten (Kigas, Räume, etc.)'
    ),
    '/state/canRemoveLocations': (
        'kann Locations löschen (Kigas, Räume, etc.)'
    ),

    '/state/canReadExternalPersons': (
        'kann Externe Personen einsehen (z.B. Ärzte)'
    ),
    '/state/canWriteExternalPersons': (
        'kann Externe Personen bearbeiten (z.B. Ärzte)'
    ),
    '/state/canRemoveExternalPersons': (
        'kann Externe Personen löschen (z.B. Ärzte)'
    ),

    '/state/canReadExternalOrganizations': (
        'kann Externe Organisationen einsehen (z.B. Träger)'
    ),
    '/state/canWriteExternalOrganizations': (
        'kann Externe Organisationen bearbeiten (z.B. Träger)'
    ),
    '/state/canRemoveExternalOrganizations': (
        'kann Externe Organisationen löschen (z.B. Träger)'
    ),

    '/state/canReadStudyTopics': (
        'kann Themengebiete einsehen'
    ),
    '/state/canWriteStudyTopics': (
        'kann Themengebiete bearbeiten'
    ),
    '/state/canRemoveStudyTopics': (
        'kann Themengebiete löschen'
    ),

    '/state/canReadHelperSets': (
        'kann Hilfstabellen einsehen'
    ),
    '/state/canWriteHelperSets': (
        'kann Hilfstabellen bearbeiten'
    ),
    '/state/canRemoveHelperSets': (
        'kann Hilfstabellen löschen'
    ),

    '/state/canReadPersonnel': (
        'kann Mitarbeiter:innen einsehen (d.h. Benutzer-Accounts)'
    ),
    '/state/canWritePersonnel': (
        'kann Mitarbeiter:innen bearbeiten (d.h. Benutzer-Accounts)'
    ),
    '/state/canAllowLogin': (
        'kann Mitarbeiter:innen Login-Erlaubnis gewähren und entziehen'
    ),
    '/state/canSetPersonnelPassword': (
        'kann das Passwort anderer Mitarbeiter:innen manuell neu setzen'
    ),

    '/state/canReadStudies': (
        'kann Studien einsehen'
    ),
    '/state/canWriteStudies': (
        'kann Studien anlegen und bearbeiten'
    ),
    '/state/canRemoveStudies': (
        'kann Studien löschen'
    ),

    '/state/canReadSubjects': (
        'kann Proband:innen einsehen'
    ),
    '/state/canWriteSubjects': (
        'kann Proband:innen anlegen und bearbeiten'
    ),
    '/state/canRemoveSubjects': (
        'kann Proband:innen löschen'
    ),

    '/state/canReadParticipation': (
        'kann einsehen welche Proband:innen an einer Studie teilgeommen haben'
    ),
    '/state/canWriteParticipation': (
        'kann manuell Proband:innen in eine Studie eintragen'
    ),
    '/state/canCreateReservationsWithinTheNext3Days': (
        'kann Räume/Teams innerhalb der nächsten 3 Tage reservieren'
    ),
    '/state/canCreateExperimentsWithinTheNext3Days': (
        'kann Termine innerhalb der nächsten 3 Tage machen'
    ),
    '/state/canUseExtendedSearch': (
        'kann die Erweiterte Suche benutzen'
    ),
    '/state/canUseCSVExport': (
        'kann CSV-Export benutzen'
    ),
    '/state/canViewReceptionCalendar': (
        'kann Rezeptionskalender einsehen'
    ),

    ...inviteLabOpsLabels('inhouse'),
    ...inviteLabOpsLabels('online-video-call'),
    ...awayTeamLabOpsLabels('away-team'),
    ...surveyLabOpsLabels('online-survey'),
}

const [ SystemRole, SystemRoleContext ] = createBase();
addComponents(SystemRole, SystemRoleContext, labels, [
    {
        cname: 'SequenceNumber',
        path: '/sequenceNumber',
        Component: withPair(SaneString)
    },
    {
        cname: 'Name',
        path: '/state/name',
        Component: withPair(SaneString)
    },
    
    ...(
        Object.keys(labels)
        .filter(path => (
            !['/sequenceNumber', '/state/name'].includes(path)
            && !path.startsWith('/state/labOperation')
        ))
        .map(path => {
            var flag = path.split('/').pop();
            return {
                cname: cc(flag),
                path,
                Component: withPair(DefaultBool)
            }
        })
    ),

    ...(
        Object.keys(labels)
        .filter(path => path.startsWith('/state/labOperation'))
        .map(path => {
            var [ type, flag ] = path.split('/').slice(-2);

            return {
                cname: 'LabOperation' + cc(type) + cc(flag),
                path,
                Component: withPair(DefaultBool)
            }
        })
    )
]);

export default SystemRole;
