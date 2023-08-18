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
        en: 'Voice-Mail',
        de: 'Anrufbeantworter'
    },
    {
        en: 'Could Not Contact',
        de: 'Nicht Erreicht'
    },
]

export const createTranslate = (lang = 'en') => (template, props) => {
    var map = maps.find(it => it.en === template);

    var translatedTemplate = map && map[lang];
    if (translatedTemplate) {
        return render(translatedTemplate, props);
    }
    else {
        return render('[!! ' + template + ' !!]', props);
    }
}
