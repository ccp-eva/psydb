import render from 'es6-template-strings';

var maps = [
    {
        en: 'Subjects',
        de: 'Proband:innen'
    },
    {
        en: 'Studies',
        de: 'Studien',
    },
    {
        en: 'Calendars',
        de: 'Kalender'
    },
    {
        en: 'Reception',
        de: 'Rezeption',
    },
    {
        en: 'Inhouse Appointments',
        de: 'Interne Termine'
    },
    {
        en: 'External Appointments',
        de: 'Externe Termine'
    },
    {
        en: 'Video Appointments',
        de: 'Video-Termine',
    },
    {
        en: 'Lab Operation',
        de: 'Studienbetrieb'
    },
    {
        en: 'Reservation',
        de: 'Reservierung'
    },
    {
        en: 'Subject Selection',
        de: 'Proband:innenauswahl'
    },
    {
        en: 'Confirm Appointments',
        de: 'Terminbestätigung'
    },
    {
        en: 'Postprocessing',
        de: 'Nachbereitung'
    },
    {
        en: 'Locations',
        de: 'Locations'
    },
    {
        en: 'External Persons',
        de: 'Externe Personen'
    },
    {
        en: 'External Organizations',
        de: 'Externe Organisationen'
    },
    {
        en: 'Study Topics',
        de: 'Themengebiete'
    },
    {
        en: 'Helper Tables',
        de: 'Hilfstabellen'
    },
    {
        en: 'Personnel',
        de: 'Mitarbeiter:innen'
    },
    {
        en: 'Research Groups',
        de: 'Forschungsgruppen'
    },
    {
        en: 'System Roles',
        de: 'System-Rollen'
    },
    {
        en: 'Record Types',
        de: 'Datensatz-Typen'
    },

    {
        en: 'Sign Out',
        de: 'Abmelden'
    },

    {
        en: 'Functions',
        de: 'Funktionen'
    },
    {
        en: 'Select Research Group',
        de: 'Forschungsgruppe wählen'
    },
    {
        en: 'Language: ${lang}',
        de: 'Sprache: ${lang}'
    },
    {
        en: 'Change Password',
        de: 'Passwort ändern'
    },
    
    {
        en: 'All Available',
        de: 'Alle Verfügbaren'
    },
    {
        en: 'New password and repeated are not the same!',
        de: 'Neues Passwort und Wiederholung sind nicht identisch!'
    },
    {
        en: 'New password is too weak!',
        de: 'Neues Passwort is zu schwach!'
    },
    {
        en: 'Current password is invalid!',
        de: 'Aktuelles Passwort ist ungültig!'
    },
    
    {
        en: 'Current Password',
        de: 'Aktuelles Passwort'
    },
    {
        en: 'New Password',
        de: 'Neues Passwort'
    },
    {
        en: 'Repeat New Password',
        de: 'Wiederholen'
    },
    {
        en: 'Error',
        de: 'Fehler'
    },
    {
        en: 'Save',
        de: 'Speichern'
    },
    {
        en: 'Password changed!',
        de: 'Passwort geändert!'
    },
    {
        en: 'Close',
        de: 'Schliessen'
    },
    {
        en: 'No Appointments',
        de: 'Keine Termine'
    },
    {
        en: 'Calendar Week',
        de: 'KW'
    },
    {
        en: 'Previous Page',
        de: 'Vorherige Seite'
    },
    {
        en: 'Next Page',
        de: 'Nächste Seite'
    },
    {
        en: 'No research groups found',
        de: 'Keine Forschungsgruppen gefunden'
    },
    {
        en: 'Research Group',
        de: 'Forschungsgruppe'
    },
    {
        internal: 'timerange_to',
        en: 'to',
        de: 'bis'
    },
    {
        en: 'View',
        de: 'Ansicht'
    },
    {
        en: 'Day',
        de: 'tag'
    },
    {
        en: '3-Day',
        de: '3-Tage'
    },
    {
        en: 'Week',
        de: 'Woche'
    },
    {
        en: 'All',
        de: 'Alle'
    },
    {
        en: 'Show Past',
        de: 'Vergangenheit anzeigen'
    },
    {
        en: 'Hide Past',
        de: 'Vergangenheit ausblenden'
    },
    {
        en: 'Placeholder',
        de: 'Platzhalter'
    },
    {
        en: 'Open Postprocessing',
        de: 'Offene Nachbereitung'
    },
    {
        en: 'In Postprocessing',
        de: 'In Nachbereitung'
    },
    {
        en: 'Completed',
        de: 'Abgeschlossen'
    },
    {
        en: 'Room',
        de: 'Raum'
    },
    {
        en: 'Team',
        de: 'Team'
    },
    {
        en: 'Study',
        de: 'Studie'
    },
    {
        en: 'Appointment Functions',
        de: 'Termin-Funktionen'
    },
    {
        en: 'Appointment Details',
        de: 'Termin-Details'
    },
    {
        en: 'Change Team',
        de: 'Team ändern'
    },
    {
        en: 'Change Room',
        de: 'Raum ändern'
    },
    {
        en: 'Follow-Up Appointment',
        de: 'Folgetermin'
    },
    {
        en: 'Reschedule',
        de: 'Verschieben'
    },
    {
        en: 'Cancel',
        de: 'Absagen'
    },
    {
        en: 'Canceled',
        de: 'Abgesagt'
    },
    {
        en: 'Subject Functions for Appointment',
        de: 'Proband:innen Funktionen für Termin'
    },
    {
        en: 'Subject Details',
        de: 'Proband:innen Details'
    },
    {
        en: 'Comment',
        de: 'Kommentar'
    },
    {
        en: 'Remove',
        de: 'Entfernen'
    },
    {
        en: 'Confirm',
        de: 'Bestätigen'
    },
    {
        en: 'Mailbox',
        de: 'Anrufbeantworter'
    },
    {
        en: 'Failed to Contact',
        de: 'Nicht Erreicht'
    },
    {
        internal: 'confirmed_icon',
        en: 'C',
        de: 'B'
    },
    {
        internal: 'mailbox_icon',
        en: 'MB',
        de: 'AB'
    },
    {
        internal: 'contact-failed_icon',
        en: 'F',
        de: 'NE'
    },
    {
        en: 'Legend',
        de: 'Legende'
    },
    {
        en: 'Appointment',
        de: 'Termin'
    },
    {
        en: 'Details',
        de: 'Details'
    },
    {
        en: 'Appointment Deleted',
        de: 'Termin gelöscht'
    },
    {
        en: 'Appointment was deleted successfully',
        de: 'Termin erfolgreich gelöscht'
    },
    {
        en: 'Date',
        de: 'Datum'
    },
    {
        en: 'Time',
        de: 'Uhrzeit'
    },
    {
        en: 'Type',
        de: 'Typ'
    },
    {
        en: 'Location Type',
        de: 'Location-Typ'
    },
    {
        en: 'Location',
        de: 'Location'
    },
    {
        en: 'Unknown',
        de: 'Unbekannt'
    },
    {
        en: 'No Comment',
        de: 'Kein Kommentar'
    },
    {
        en: 'Current',
        de: 'Aktuell'
    },
    {
        en: 'Change To',
        de: 'Ändern zu'
    },
    {
        en: 'Change Study',
        de: 'Studie ändern'
    },
    {
        en: 'Add Subject',
        de: 'Proband:in hinzufügen'
    },
    {
        en: 'Subjects (short)',
        de: 'Proband:innen (kurz)'
    },
    {
        en: 'Only Names',
        de: 'nur Namen'
    },
    {
        en: 'T-Age',
        de: 'T-Alter'
    },
    {
        en: 'Part. Stud.',
        de: 'Teilg. Stud.'
    },
    {
        en: 'Status',
        de: 'Status'
    },
    {
        internal: 'unknown_short',
        en: 'unk.',
        de: 'unb.',
    },
    {
        internal: 'participated_short',
        en: 'p.',
        de: 't.g.',
    },
    {
        internal: 'didnt-participate_short',
        en: 'not p.',
        de: 'n.t.g.',
    },
    {
        internal: 'showed-up-but-didnt-participate_short',
        en: 'only s.u.',
        de: 'gek.',
    },
    {
        internal: 'didnt-show-up_short',
        en: 'not s.u.',
        de: 'n. gek.',
    },
    {
        internal: 'canceled-by-participant_short',
        en: 'canceled b.p.',
        de: 'abg.',
    },
    {
        internal: 'canceled-by-institute_short',
        en: 'uninv.',
        de: 'ausg.',
    },
    {
        internal: 'moved_short',
        en: 'resc.',
        de: 'versch.',
    },
    
    {
        internal: 'unknown',
        en: 'Unknown',
        de: 'Unbekannt',
    },
    {
        internal: 'participated',
        en: 'Participated',
        de: 'Teilgenommen',
    },
    {
        internal: 'didnt-participate',
        en: 'Did Not Participate',
        de: 'Nicht Teilgenommen',
    },
    {
        internal: 'showed-up-but-didnt-participate',
        en: 'Only Showed Up',
        de: 'Gekommen',
    },
    {
        internal: 'didnt-show-up',
        en: 'Did Not Show Up',
        de: 'Nicht Gekommen',
    },
    {
        internal: 'canceled-by-participant',
        en: 'Canceled by Participant',
        de: 'Abgesagt',
    },
    {
        internal: 'canceled-by-institute',
        en: 'Uninvited',
        de: 'Ausgeladen',
    },
    {
        internal: 'moved',
        en: 'Rescheduled',
        de: 'Verschoben',
    },


    {
        en: 'Subjects to Postprocess',
        de: 'Nachzubereitende Proband:innen',
    },
    {
        en: 'Postprocessed Subjects',
        de: 'Nachbereitete Proband:innen',
    },
    {
        en: 'Set Remaining to "Not Participated"',
        de: 'Verbleibende auf "Nicht Teilgenommen" setzen',
    },
    {
        en: 'Edit (${subjectLabel})',
        de: 'Bearbeitung (${subjectLabel})',
    },
    {
        en: 'Last Appointment?',
        de: 'Letzter Termin?',
    },
    {
        en: 'Edit',
        de: 'Bearbeiten'
    },
    {
        en: 'Items',
        de: 'Einträge',
    },
    {
        en: 'Subject',
        de: 'Proband:in'
    },
    {
        en: 'No subjects have been postprocessed yet.',
        de: 'Bisher keine Proband:innen nachbereitet.'
    },
    {
        en: 'Permission Denied',
        de: 'Zugriff Verweigert'
    },
    {
        en: 'Study Selection',
        de: 'Studienauswahl'
    },
    {
        en: 'No lab teams exist for this study.',
        de: 'Keine Experimenter:innen-Teams in dieser Studie.'
    },
    {
        en: 'Reservations are not available for this study.',
        de: 'Für diese Studie ist keine Reservierung möglich.'
    },
    {
        en: 'Go To Study Settings',
        de: 'Zu den Studien-Einstellungen'
    },
    {
        en: 'Away Teams',
        de: 'Außen-Teams'
    },
    {
        internal: 'reservable_locations',
        en: 'Rooms',
        de: 'Räumlichkeiten'
    },
    {
        en: 'No rooms for inhouse/video appointments set.',
        de: 'Keine Räumlichkeiten für Interne/Video-Termine festgelegt.'
    },
    {
        en: 'Start',
        de: 'Beginn'
    },
    {
        en: 'End',
        de: 'Ende'
    },
    {
        en: 'Yes',
        de: 'Ja'
    },
    {
        en: 'No',
        de: 'Nein'
    },
    {
        en: 'Delete',
        de: 'Löschen'
    },
    {
        en: 'Reserve',
        de: 'Reservieren'
    },
    {
        en: 'Inhouse Study',
        de: 'Interne Studie'
    },
    {
        en: 'External Study',
        de: 'Externe Studie'
    },
    {
        en: 'Online Video Call',
        de: 'Online-Video-Anruf'
    },
    {
        en: 'Online Survey',
        de: 'Online-Umfrage'
    },
    {
        en: 'Next',
        de: 'Weiter'
    },
    {
        en: 'Selected',
        de: 'Ausgewählt'
    },
    {
        en: 'No active studies found.',
        de: 'Keine laufenden Studien gefunden.'
    },
    {
        en: 'Search',
        de: 'Suchen'
    },
    {
        en: 'Appointment Time Range',
        de: 'Terminzeitraum'
    },
    {
        en: 'Age Range',
        de: 'Altersfenster'
    },
    {
        en: 'Desired Time Range',
        de: 'Gewünschter Zeitraum'
    },
    {
        en: 'Age Today',
        de: 'Alter Heute'
    },
    {
        en: 'Part. Studies',
        de: 'Teilg. Studien'
    },
    {
        en: 'Part. Studies',
        de: 'Teilg. Studien'
    },
    {
        en: 'Appointments',
        de: 'Termine'
    },
    {
        en: 'Poss. Studies',
        de: 'Mögl. Studien'
    },
    {
        en: 'None',
        de: 'Keine'
    },
    {
        en: 'Appointment',
        de: 'Termin'
    },
    {
        en: 'Study Participation',
        de: 'Studien-Teilnahme'
    },
    {
        en: 'Invitation',
        de: 'Einladung'
    },
    {
        en: 'Appointment Invitation',
        de: 'Termin-Einladung'
    },
    {
        en: 'Subject data saved!',
        de: 'Proband:innendaten gespeichert!'
    },
    {
        en: 'Edit Again',
        de: 'Erneut Bearbeiten'
    },
    {
        en: 'Subject Appointments in ${study}',
        de: 'Termine der Proband:in in ${study}'
    },
    {
        en: 'Not in Age Range',
        de: 'Nicht in Altersfenster'
    },
    {
        en: 'Add',
        de: 'Hinzufügen'
    },
    {
        en: 'No study participations found.',
        de: 'Keine Studienteilnahmen gefunden.'
    },
    {
        en: 'Date/Time',
        de: 'Zeitpunkt'
    },
    {
        en: 'per Appointment',
        de: 'pro Termin'
    },
    {
        en: 'Conditions',
        de: 'Bedingungen'
    },
    {
        en: 'ID No.',
        de: 'ID Nr.'
    },
    {
        internal: '_designation',
        en: 'Name',
        de: 'Bezeichnung'
    },
    {
        en: 'Shorthand',
        de: 'Kürzel'
    },
    {
        en: 'Subjects can be tested multiple times',
        de: 'Proband:innen können mehrfach getestet werden'
    },
    {
        en: 'Scientists',
        de: 'Wissenschaftler:innen'
    },
    {
        en: 'Record Access for',
        de: 'Zugriff auf diesen Datensatz für'
    },
    {
        en: 'Read',
        de: 'Lesen'
    },
    {
        en: 'Write',
        de: 'Schreiben'
    },
    {
        en: 'Not Specified',
        de: 'Keine Angabe'
    },
    {
        en: 'primary',
        de: 'primär'
    },
    {
        en: 'Female',
        de: 'Weiblich'
    },
    {
        en: 'Male',
        de: 'Männlich'
    },
]

export const createTranslate = (lang = 'en') => (template, props) => {
    var map = maps.find(it => it.internal === template || it.en === template);

    var translatedTemplate = map && map[lang];
    if (translatedTemplate) {
        return render(translatedTemplate, props);
    }
    else {
        return render('[!! ' + template + ' !!]', props);
        // FIXME: temp compat
        //return render(template, props);
    }
}
