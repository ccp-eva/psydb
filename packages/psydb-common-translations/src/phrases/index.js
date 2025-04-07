'use strict';
module.exports = [
    ...require('./appointments'),
    ...require('./studies'),
    ...require('./subjects'),
    ...require('./subject-groups'),
    ...require('./locations'),
    ...require('./external-organizations'),

    ...require('./lab-workflows'),

    ...require('./helper-tables'),
    ...require('./permissions'),
    ...require('./crt-editor'),
    ...require('./csv-imports'),
    ...require('./duplicates'),

    ...require('./_fieldtype'),
    ...require('./_participationStatus'),
    ...require('./_phone'),
    ...require('./_address'),
    ...require('./_record_picker'),
    ...require('./_form_array'),
    ...require('./_stringify-fields'),


    {
        en: 'Calendars',
        de: 'Kalender'
    },
    {
        en: 'Reception',
        de: 'Rezeption',
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
        en: 'Postprocessing',
        de: 'Nachbereitung'
    },
    {
        en: 'Postprocessing (${subject} - ${study})',
        de: 'Nachbereitung (${subject} - ${study})',
    },
    {
        en: 'External Persons',
        de: 'Externe Personen'
    },
    {
        en: 'Study Topics',
        de: 'Themengebiete'
    },
    {
        en: 'Staff Members',
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
        internal: '_sidenav_custom-record-types',
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
        de: 'Tag'
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
        en: 'Change Team',
        de: 'Team ändern'
    },
    {
        en: 'Change Room',
        de: 'Raum ändern'
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
        en: 'Details',
        de: 'Details'
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
        en: 'Unknown',
        de: 'Unbekannt'
    },
    {
        // FIXME
        internal: '_biologicalGender_other',
        en: 'Other',
        de: 'Divers'
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
        en: 'Only Names',
        de: 'nur Namen'
    },
    {
        en: 'T-Age',
        de: 'T-Alter'
    },
    {
        en: 'Study Participations',
        de: 'Studien-Teilnahmen'
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
        en: 'Statistics',
        de: 'Statistiken'
    },
    {
        en: 'Study Statistics',
        de: 'Studien-Statistiken'
    },
    {
        en: 'Subject Statistics',
        de: 'Proband:innen-Statistiken'
    },
    {
        en: 'Logic Operation',
        de: 'Logische Verknüpfung'  
    },
    {
        internal: '_logicGate_and',
        en: 'AND',
        de: 'UND'
    },
    {
        internal: '_logicGate_or',
        en: 'OR',
        de: 'ODER'
    },
    {
        internal: '_studyParticipations_short',
        en: 'Part.',
        de: 'Teiln.',
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
        en: 'Set Remaining to "Not Participated"',
        de: 'Verbleibende auf "Nicht Teilgenommen" setzen',
    },
    {
        en: 'Edit (${subjectLabel})',
        de: 'Bearbeitung (${subjectLabel})',
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
        en: 'Permission Denied',
        de: 'Zugriff Verweigert'
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
        en: 'Search',
        de: 'Suchen'
    },
    {
        en: 'Age Range',
        de: 'Altersfenster'
    },
    {
        en: 'Age Ranges',
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
        en: 'None',
        de: 'Keine'
    },
    {
        en: 'Study Participation',
        de: 'Studienteilnahme'
    },
    {
        en: 'Invitation',
        de: 'Einladung'
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
        en: 'Condition',
        de: 'Bedingung'
    },
    {
        en: 'Conditions',
        de: 'Bedingungen'
    },
    {
        en: 'Internal ID',
        de: 'Interne ID',
    },
    {
        en: 'Internal ID (from Duplicate)',
        de: 'Interne ID (von Duplikat)',
    },
    {
        en: 'ID No.',
        de: 'ID Nr.'
    },
    {
        en: 'ID No. (from Duplicate)',
        de: 'ID Nr. (von Duplikat)'
    },
    {
        en: 'Online ID Code',
        de: 'Online ID Code'
    },
    {
        en: 'Online ID Code (from Duplicate)',
        de: 'Online ID Code (von Duplikat)'
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
        en: 'Scientist',
        de: 'Wissenschaftler:in'
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
    {
        en: 'Total',
        de: 'Gesamt'
    },
    {
        en: 'per Page',
        de: 'pro Seite'
    },
    {
        en: 'to Page',
        de: 'zu Seite'
    },
    {
        en: 'Page',
        de: 'Seite'
    },
    {
        internal: '_pagination_of',
        en: 'of',
        de: 'von'
    },
    {
        internal: '_count_short',
        en: 'Count',
        de: 'Anz.'
    },
    {
        internal: '_not_at_weekday',
        en: 'not on',
        de: 'nicht am'
    },
    {
        en: 'Select All',
        de: 'Alle Auswählen'
    },
    {
        en: 'Deselect All',
        de: 'Alle Abwählen'
    },
    {
        en: 'Reschedule To',
        de: 'Verschieben Auf'
    },
    {
        en: 'No Comment',
        de: 'Kein Kommentar'
    },
    {
        en: 'Reason',
        de: 'Grund'
    },
    {
        en: 'Block Until',
        de: 'Sperren Bis'
    },
    {
        en: 'Remove Old Reservation',
        de: 'Alte Reservierung Entfernen'
    },
    {
        internal: '_followUpExpSubjectOp_none',
        en: 'No Action',
        de: 'Keine Aktion'
    },
    {
        internal: '_followUpExpSubjectOp_move-unprocessed',
        en: 'Move Remaining',
        de: 'Verbleibende Mitnehmen'
    },
    {
        internal: '_followUpExpSubjectOp_copy',
        en: 'Copy All',
        de: 'Alle Kopieren'
    },
    {
        en: 'Really remove this Subject from the Appointment?',
        de: 'Diese Proband:in wirklich aus Termin austragen?',
    },
    {
        en: 'This will remove the subject from the appointment completely!',
        de: 'Die Proband:in wird dabei endgültig aus dem Termin entfernt!',
    },
    {
        en: 'Remove Subject from Appointment',
        de: 'Proband:in aus Termin entfernen'
    },
    {
        en: 'New Record',
        de: 'Neuer Eintrag',
    },
    {
        en: 'Advanced Search',
        de: 'Erweiterte Suche'
    },
    {
        en: 'CSV Export',
        de: 'CSV-Export'
    },
    {
        en: 'No Records found.',
        de: 'Keine Datensätze gefunden.'
    },
    {
        en: 'Show Hidden',
        de: 'Ausgeblendete Anzeigen'
    },
    {
        en: 'Overview',
        de: 'Übersicht'
    },
    {
        en: 'Study Topic',
        de: 'Themengebiet'
    },
    {
        en: 'New Study Topic',
        de: 'Neues Themengebiet'
    },
    {
        en: 'Edit Study Topic',
        de: 'Themengebiet Bearbeiten'
    },
    {
        en: 'Delete Study Topic',
        de: 'Themengebiet Löschen'
    },
    {
        en: 'Study topic is referenced by other records!',
        de: 'Themengebiet wird von anderen Datensätzen referenziert!'
    },
    {
        en: 'Study topic was deleted successfully!',
        de: 'Themengebiet wurde erfolgreich gelöscht!'
    },
    {
        en: 'Back to List',
        de: 'Zurück zur Liste'
    },
    {
        en: 'Hide',
        de: 'Ausblenden'
    },
    {
        en: 'Unhide',
        de: 'Einblenden'
    },
    {
        en: 'Fields',
        de: 'Felder'
    },
    {
        en: 'Firstname',
        de: 'Vorname'
    },
    {
        en: 'Lastname',
        de: 'Nachname'
    },
    {
        en: 'E-Mails',
        de: 'E-Mails'
    },
    {
        en: 'Phone',
        de: 'Telefon'
    },
    {
        en: 'Description',
        de: 'Beschreibung'
    },
    {
        en: 'Allow Log-In',
        de: 'Log-In Erlauben'
    },
    {
        en: 'Has Admin Access',
        de: 'Hat Admin-Zugriff'
    },
    {
        en: 'Edit Staff Member',
        de: 'Mitarbeiter:in Bearbeiten'
    },
    {
        en: 'Staff Member Details',
        de: 'Mitarbeiter:innen-Details'
    },
    {
        en: 'Generate Automatically',
        de: 'Automatisch Generieren'
    },
    {
        en: 'Set Manually',
        de: 'Manuell Setzen'
    },
    {
        en: 'Change Staff Member Password',
        de: 'Mitarbeiter:innen-Passwort Ändern'
    },
    {
        en: 'Method',
        de: 'Methode'
    },
    {
        en: 'Change Password',
        de: 'Passwort Ändern'
    },
    {
        en: 'Hidden Record',
        de: 'Ausgeblendeter Datensatz'
    },
    {
        en: 'Address',
        de: 'Adresse'
    },
    {
        en: 'New Research Group',
        de: 'Neue Forschungsgruppe'
    },
    {
        en: 'Research Group Details',
        de: 'Forschungsgruppen-Details'
    },
    {
        en: 'Edit Research Group',
        de: 'Forschungsgruppe Bearbeiten'
    },
    {
        en: 'Reservable From',
        de: 'Reservierbar Von'
    },
    {
        en: 'Reservable To',
        de: 'Reservierbar Bis'
    },
    {
        en: 'Reservable From/To',
        de: 'Reservierbar Von/Bis'
    },
    {
        en: 'Weekdays',
        de: 'Wochentage'
    },
    {
        en: 'There are still ${count} subjects in this location!',
        de: 'Es sind noch ${count} Proband:innen in dieser Location!'
    },
    {
        en: 'There still exist ${count} appointments in this location!',
        de: 'Es existieren noch ${count} Termine in dieser Location!'
    },
    {
        en: 'Detach subjects from this location (e.g. for kindergardens)',
        de: 'Proband:innen aus dieser Location herausnehmen (z.B. bei Kindergärten)'
    },
    {
        en: 'Save and Unhide',
        de: 'Speichern und Einblenden'
    },
    {
        en: 'Save and Hide',
        de: 'Speichern und Ausblenden'
    },
    {
        en: 'Subject has participated in studies!',
        de: 'Proband:in hat an Studien teilgenommen!'
    },
    {
        en: 'Collected Data',
        de: 'Erfasste Daten'
    },
    {
        en: 'Record Details',
        de: 'Datensatz-Details'
    },
    {
        en: 'History',
        de: 'Historie'
    },
    {
        en: 'Add Participation',
        de: 'Teilnahme Hinzfügen'
    },
    {
        en: 'Appointment for Subject',
        de: 'Termin für Proband:in'
    },
    {
        en: 'Please select study and appointment type.',
        de: 'Bitte Studie und Termin-Typ wählen.'
    },
    {
        en: 'Experimenters',
        de: 'Experimenter:innen'
    },
    {
        en: 'Add Study Participation',
        de: 'Studienteilnahme Hinzufügen'
    },
    {
        en: 'Edit Participation',
        de: 'Studienteilnahme Bearbeiten'
    },
    {
        en: 'Delete Participation',
        de: 'Studienteilnahme Löschen'
    },
    {
        en: 'Selection Settings',
        de: 'Auswahlbedingungen'
    },
    {
        en: 'General',
        de: 'Allgemein'
    },
    {
        en: 'Teams',
        de: 'Teams'
    },
    {
        en: 'Scientists',
        de: 'Wissenschaftler:innen'
    },
    {
        en: 'Hidden',
        de: 'Ausgeblendet'
    },
    {
        en: 'There exist study participations!',
        de: 'Es existieren Studienteilnahmen!'
    },
    {
        en: 'General Conditions',
        de: 'Allgemeine Bedingungen'
    },
    {
        en: 'No subject types with selection settings.',
        de: 'Keine Proband:innentypen mit Auswahlbedingungen.'
    },
    {
        en: 'Add Age Range',
        de: 'Altersfenster hinzufügen'
    },
    {
        en: 'No Age Ranges',
        de: 'Keine Altersfenster'
    },
    {
        internal: '_age_frame_placeholder',
        en: 'Y/M/D',
        de: 'J/M/T'
    },
    {
        en: 'Field',
        de: 'Feld'
    },
    {
        en: 'Values',
        de: 'Werte'
    },
    {
        en: 'No Items',
        de: 'Keine Einträge'
    },
    {
        en: 'Edit Age Range',
        de: 'Altersfenster Bearbeiten'
    },
    {
        en: 'Delete Age Range',
        de: 'Altersfenster Löschen'
    },
    {
        en: 'Really delete the age range?',
        de: 'Dieses Altersfenster wirklich löschen?'
    },
    {
        en: 'Really delete this subject type from the study?',
        de: 'Wirklich diesen Proband:innen-Typ aus dieser Studie löschen?'
    },
    {
        en: 'Please add settings for at least one subject type.',
        de: 'Bitte Einstellungen für mindestens einen Proband:innen-Typ hinzufügen.'
    },
    {
        en: 'Add Settings',
        de: 'Einstellungen hinzufügen'
    },
    {
        en: 'Settings',
        de: 'Einstellungen'
    },
    {
        en: 'Appointment Conditions',
        de: 'Terminbedingungen'
    },
    {
        en: 'Is Equal in Appointment',
        de: 'Ist Gleich im Termin'
    },
    {
        en: 'Edit Settings',
        de: 'Einstellungen bearbeiten'
    },
    {
        en: 'Delete Settings',
        de: 'Einstellungen löschen'
    },
    {
        en: 'There are still appointments with this lab workflow!',
        de: 'Es gibt noch Termine mit diesem Ablauf!'
    },
    {
        en: 'There are still appointments with this lab workflow and subject type!',
        de: 'Es gibt noch Termine mit diesem Ablauf und Proband:innen-Typ!'
    },
    {
        en: 'New Team',
        de: 'Neues Team'
    },
    {
        en: 'Edit Team',
        de: 'Team Bearbeiten'
    },
    {
        en: 'No teams in this study.',
        de: 'Keine Teams in dieser Studie.'
    },
    {
        en: 'Color',
        de: 'Farbe'
    },
    {
        en: 'Hide Team',
        de: 'Team Ausblenden'
    },
    {
        en: 'Really hide this team?',
        de: 'Dieses Team wirklich ausblenden?'
    },
    {
        en: 'CSV Import',
        de: 'CSV-Import'
    },
    {
        en: '${count} errors found!',
        de: '${count} Fehler gefunden!'
    },
    {
        en: 'No errors found!',
        de: 'Keine Fehler gefunden!'
    },
    {
        en: 'Please wait...',
        de: 'Bitte warten...'
    },
    {
        internal: '_perform_import',
        en: 'Import',
        de: 'Importieren'
    },
    {
        en: 'Drag files here to upload them or click to select files for upload.',
        de: 'Dateien hierher ziehen um sie hochzuladen oder klicken um Dateien für den Upload auszuwählen.'
    },
    {
        en: 'Delete Study Participation',
        de: 'Studienteilnahme Löschen'
    },
    {
        en: 'Really delete this study participation?',
        de: 'Diese Studienteilnnahme wirklich löschen?'
    },
    {
        internal: '_date_placeholder',
        'en-US': 'mm/dd/yyyy',
        'en-GB': 'dd/mm/yyyy',
        'de': 'tt.mm.jjjj',
    },
    {
        internal: '_date_time_placeholder',
        'en-US': 'mm/dd/yyyy --:-- am/pm',
        'en-GB': 'dd/mm/yyyy --:--',
        'de': 'tt.mm.jjjj --:--',
    },
    {
        en: 'Permission',
        de: 'Berechtigung'
    },
    {
        internal: '_email_is_primary',
        en: 'Primary Address',
        de: 'Primäre Adresse'
    },
    {
        en: 'E-Mail',
        de: 'E-Mail'
    },
    {
        en: 'System Role',
        de: 'System-Rolle'
    },
    {
        internal: '_testing_permission_for',
        en: 'For',
        de: 'Für'
    },
    {
        internal: '_testing_permission_value',
        en: 'Permission',
        de: 'Erlaubnis'
    },
    {
        internal: '_extended_search_filters_tab',
        en: 'Search Conditions',
        de: 'Suchbedingungen',
    },
    {
        internal: '_extended_search_columns_tab',
        en: 'Columns',
        de: 'Spalten',
    },
    {
        internal: '_extended_search_results_tab',
        en: 'Result List',
        de: 'Ergebnisliste',
    },
    {
        internal: '_statistics_filters_tab',
        en: 'Search Conditions',
        de: 'Suchbedingungen',
    },
    {
        internal: '_statistics_results_tab',
        en: 'Result List',
        de: 'Ergebnisliste',
    },
    {
        en: 'Has Participation Permission',
        de: 'Hat Teilnahme-Erlaubnis',
    },
    {
        en: 'Has Participated in',
        de: 'Hat Teilgenommen an',
    },
    {
        en: 'Has Not Participated in',
        de: 'Hat Nicht Teilgenommen an',
    },
    {
        internal: '_isHidden_any',
        en: 'Show All',
        de: 'Alle Anzeigen',
    },
    {
        internal: '_isHidden_only-false',
        en: 'Do Not Show',
        de: 'Nicht Anzeigen',
    },
    {
        internal: '_isHidden_only-true',
        en: 'Only Show Hidden',
        de: 'Nur Ausgeblendete Anzeigen',
    },
    {
        en: 'Hidden Records',
        de: 'Ausgeblendete Datensätze',
    },
    {
        en: 'Minimum',
        de: 'Minimum',
    },
    {
        en: 'Maximum',
        de: 'Maximum',
    },
    {
        en: 'No Conditions',
        de: 'Keine Bedingungen',
    },
    {
        en: 'Specific Values',
        de: 'Spezifische Werte',
    },
    {
        en: 'Not with theese Values',
        de: 'Nicht mit diesen Werten',
    },
    {
        en: 'Has Any Value',
        de: 'Mit beliebigem Wert',
    },
    {
        en: 'Has No Value',
        de: 'Mit keinem Wert',
    },
    {
        en: 'Values',
        de: 'Werte',
    },
    {
        internal: '_range_from',
        en: 'From',
        de: 'Von',
    },
    {
        internal: '_range_to',
        en: 'To',
        de: 'Bis',
    },
    {
        en: 'Participation Range',
        de: 'Teilnahme-Zeitraum'
    },
    {
        en: 'Date Range',
        de: 'Zeitraum'
    },
    {
        en: 'Time Range',
        de: 'Zeitraum'
    },
    {
        en: 'Historical Appointment Locations',
        de: 'Historische Termin-Locations'
    },
    {
        en: 'Sort Order',
        de: 'Sortierung'
    },
    {
        en: 'Column Order',
        de: 'Spalten Anordnung'
    },
    {
        internal: '_sort_direction',
        en: 'Direction',
        de: 'Richtung'
    },
    {
        internal: '_sort_direction_asc',
        en: 'Ascending',
        de: 'Aufsteigend'
    },
    {
        internal: '_sort_direction_desc',
        en: 'Descending',
        de: 'Absteigend'
    },
    {
        en: 'Column',
        de: 'Spalte'
    },

    {
        en: 'New System Role',
        de: 'Neue System-Rolle',
    },
    {
        en: 'Edit System Role',
        de: 'System-Rolle Bearbeiten',
    },
    {
        en: 'System Role Details',
        de: 'System-Rollen-Details',
    },


    {
        en: 'This Field is Required. Please provide a value.',
        de: 'Dies ist ein Plichtfeld. Bitte einen Wert eingeben.'
    },
    {
        en: 'Must have at least ${count} items.',
        de: 'Muss mindestens ${count} Einträge haben.'
    },
    {
        en: 'Must have at least ${count} characters.',
        de: 'Muss mindestens ${count} Zeichen haben.'
    },
    {
        en: 'Must be greater than ${limit}.',
        de: 'Muss grösser als ${limit} sein.'
    },
    {
        en: 'Must be greater than or equal ${limit}.',
        de: 'Muss grösser oder gleich ${limit} sein.'
    },
    {
        en: 'This is not a valid e-mail address.',
        de: 'Dies is keine valide E-Mail-Adresse.'
    },
    {
        en: 'Contains invalid duplicate data.',
        de: 'Enthält ungültige Duplikat-Daten.'
    },
    {
        internal: '_404_not_found',
        en: 'Not Found',
        de: 'Nicht Gefunden'
    },
    {
        internal: '_400_bad_request',
        en: 'Invalid Values',
        de: 'Fehlerhafte Eingaben'
    },
    {
        internal: '_XXX_system_error',
        en: 'System Error',
        de: 'System-Fehler'
    },
    {
        en: 'The given url could not be found.',
        de: 'Die angegebene URL konnte nicht gefunden werden.'
    },
    {
        en: 'The data sent contains invalid values.',
        de: 'Die abgesendeten Daten enthalten fehlerhafte Eingaben.'
    },

    //////////////
    


    {
        en: 'Missing',
        de: 'Fehlt'
    },
    {
        en: 'Not Set',
        de: 'Nicht Festgelegt'
    },
    {
        en: 'Format',
        de: 'Format'
    },
    {
        en: '(new)',
        de: '(neu)'
    },
    {
        en: '(edited)',
        de: '(bearbeitet)'
    },
    {
        en: 'Restore',
        de: 'Wiederherstellen'
    },
    {
        en: 'Default',
        de: 'Standard'
    },
    {
        en: 'Minimum Number',
        de: 'Mindestanzahl'
    },
    {
        en: 'Optional',
        de: 'Optional'
    },


    {
        en: 'Invalid authentication data!',
        de: 'Ungültige Anmeldedaten!'
    },
    {
        en: 'Password',
        de: 'Passwort'
    },
    {
        en: 'Sign In',
        de: 'Anmelden'
    },
    {
        en: 'PsyDB Sign In',
        de: 'PsyDB Anmeldung'
    },
    {
        en: 'Language',
        de: 'Sprache'
    },
    {
        en: 'Participation Permissions',
        de: 'Teilnahme-Erlaubnis',
    },
    {
        en: 'Enable Lab Teams',
        de: 'Mit Teams',
    },
    {
        en: 'Reservation Type',
        de: 'Reservierungs-Typ',
    },
    {
        internal: '_reservationType_inhouse',
        en: 'Inhouse Appointments',
        de: 'Interne Termine',
    },
    {
        internal: '_reservationType_away-team',
        en: 'External Appointments',
        de: 'Externe Termine',
    },
    {
        internal: '_reservationType_no-reservation',
        en: 'No Reservation',
        de: 'Keine Reservierung',
    },
    {
        en: 'Display Name (DE)',
        de: 'Anzeigename (DE)',
    },
    {
        en: 'Language Settings',
        de: 'Spracheinstellungen',
    },
    {
        en: 'Date/Time Format',
        de: 'Datums-/Zeitformat',
    },
    {
        en: 'No age frames were defined for this study.',
        de: 'Es sind keine Altersfenster für diese Studie definiert.',
    },
    {
        en: 'No further Conditions',
        de: 'Keine weiteren Bedingungen',
    },
    
    // WKPRC
    
    {
        en: 'WKPRC',
        de: 'WKPRC'
    },
    {
        en: 'Group',
        de: 'Gruppe'
    },
    {
        internal: '_wkprc_experimentName',
        en: 'Experiment Name',
        de: 'Test-Bezeichnung'
    },
    {
        internal: '_wkprc_roomOrEnclosure',
        en: 'Room/Enclosure',
        de: 'Raum/Gehege'
    },
    {
        internal: '_wkprc_subjectRole',
        en: 'Role',
        de: 'Rolle'
    },
    {
        internal: '_wkprc_intradaySeqNumber',
        en: 'Daily Running No.',
        de: 'Laufende Nummer (am Tag)'
    },
    {
        internal: '_wkprc_intradaySeqNumber_short',
        en: 'Daily-No.',
        de: 'Tägl-Nr.'
    },
    {
        internal: '_wkprc_totalSubjectCount',
        en: 'Trial Participants',
        de: 'Trial Participants' // FIXME
    },
    {
        internal: '_wkprc_totalSubjectCount_short',
        en: 'Trial-P.',
        de: 'Trial-P.' // FIXME
    },
   
    // Field sites

    {
        en: 'Field Sites',
        de: 'Field-Sites'
    },

    // audit
    {
        internal: '_sidenav_audit',
        en: 'Audit',
        de: 'Audit'
    },

    ///////////////////
    {
        en: 'Warning',
        de: 'Warnung'
    },
    {
        en: 'Could not send email!',
        de: 'E-Mail konnte nicht versand werden!'
    },
    {
        en: 'Mail-Server response is:',
        de: 'Reponse des Mail-Servers ist:'
    },


    /////////////////
    
    {
        en: 'Study Exclusion',
        de: 'Studienausschluss',
    },
    {
        en: 'All Studies',
        de: 'Alle Studien',
    },
    {
        en: 'Excluded',
        de: 'Ausgeschlossen',
    },
    {
        en: 'No Topic Constraints',
        de: 'Keine Themen-Enschränkung',
    },
    {
        en: 'Topics of this Study',
        de: 'Themen der Studie',
    },
    {
        en: 'Name/Shorthand',
        de: 'Name/Kürzel',
    },
    {
        en: 'No Studies with theese criteria.',
        de: 'Keine Studien für diese Kriterien.',
    },
    {
        en: 'The current study is excluded automatically.',
        de: 'Die aktuelle Studie wird automatisch mit ausgeschlossen.',
    },
    {
        en: 'No other studies excluded.',
        de: 'Keine anderen ausgeschlossenen Studien.',
    },
   

    {
        en: 'Hint',
        de: 'Hinweis',
    },
    {
        internal: '_participation_multi_subject_grouped_hint',
        en: 'The selection of multiple subjects will be saved as one pair/group participation.',
        de: 'Bei Auswahl mehrerer Proband:innen wird eine einzelne Paar-/Gruppenteilnahme hinterlegt.',
    },
    {
        internal: '_participation_multi_subject_ungrouped_hint',
        en: 'The selection of multiple subjects will be saved as multiple independed participations.',
        de: 'Bei Auswahl mehrerer Proband:innen wird wie mehrere unabhängige Einzelteilnahmen hinterlegt.',
    },
    {
        en: 'Last Survey?',
        de: 'Letzte Umfrage?',
    },
    {
        en: 'Please select ${that}.',
        de: 'Bitte ${that} auswählen.',
    },

    {
        internal: '_labWorkflow_online-video-call',
        en: 'Online Video Call',
        de: 'Online-Video-Anruf'
    },
    {
        internal: '_labWorkflow_online-survey',
        en: 'Online Survey',
        de: 'Online-Umfrage'
    },
    {
        internal: '_labWorkflow_inhouse',
        en: 'Inhouse Appointments',
        de: 'Interne Termine',
    },
    {
        internal: '_labWorkflow_away-team',
        en: 'External Appointments',
        de: 'Externe Termine',
    },
    {
        internal: '_labWorkflow_apestudies-wkprc-default',
        en: 'WKPRC',
        de: 'WKPRC'
    },
    {
        internal: '_labWorkflow_manual-only-participation',
        en: 'Field Sites',
        de: 'Field-Sites'
    },
    {
        en: 'Subject has Field "${field}" not set!',
        de: 'Proband:in hat Field "${field}" nicht gesetzt!'
    },
    {
        en: 'WARNING: There is no matching lab workflow setting in this study!',
        de: 'WARNUNG: Es gibt keine passende Ablauf-Einstellung in dieser Studie!',
    },
    {
        en: 'Experimenters and research group can not be changed, as the team already has appointments.',
        de: 'Experimenter:innen und Forschungsgruppe sind nicht änderbar, da das Team bereits Termine hat.'
    },

    {
        en: 'Two-Factor-Authentication Required',
        de: 'Zwei-Factor-Authentifizierung Erforderlich'
    },
    {
        en: 'You should have receved an e-mail containing a code, please enter it here.',
        de: 'Sie sollten eine E-Mail mit einem Code erhalten haben, bitte geben Sie diesen hier ein.'
    },
    {
        en: 'Back',
        de: 'Zurück'
    },
    {
        en: 'Code',
        de: 'Code'
    },
    {
        en: 'Send New Code',
        de: 'Neuen Code Zusenden'
    },
    {
        en: 'Invalid Code!',
        de: 'Ungültiger Code!',
    },
    {
        en: 'New Code Sent',
        de: 'Neuer Code Versendet'
    },
    {
        en: 'A new code was send to your e-mail. Please also check the junk folder.',
        de: 'Ein neuer Code wurde an Ihre E-Mail versendet. Bitte prüfen Sie auch den Spam-Ordner.'
    },

    {
        en: 'No lab workflows defined!',
        de: 'Keine Lab-Workflows definiert!'
    },
    {
        en: 'No study types defined!',
        de: 'Keine Studien-Typen definiert!'
    },
    {
        en: 'No subject types defined!',
        de: 'Keine Proband:innen-Typen definiert!'
    },
    {
        en: 'No location types defined!',
        de: 'Keine Location-Typen definiert!'
    },

    {
        en: 'Subject saved!',
        de: 'Proband:in gespeichert!'
    },
    {
        en: 'Edit Again',
        de: 'Erneut Bearbeiten'
    },

    {
        internal: '_sidenav_api-keys',
        en: 'API Keys',
        de: 'API-Keys'
    },
    {
        en: 'API Key',
        de: 'API-Key'
    },
    {
        en: 'New API Key',
        de: 'Neuer API-Key'
    },
    {
        en: 'API Key Details',
        de: 'API-Key-Details'
    },
    {
        en: 'Edit API Key',
        de: 'API-Key Bearbeiten'
    },
    {
        en: 'Delete API Key',
        de: 'API-Key Löschen'
    },
    {
        en: 'API Key Deleted',
        de: 'API-Key Gelöscht'
    },
    {
        en: 'API Key was deleted successfully!',
        de: 'API-Key wurde erfolgreich gelöscht!'
    },
    {
        en: 'Label',
        de: 'Bezeichnung'
    },
    {
        en: 'Enabled',
        de: 'Aktiv'
    },
    {
        en: 'Account',
        de: 'Account'
    },

    {
        en: 'Go to Record',
        de: 'Zum Datensatz',
    }
]
