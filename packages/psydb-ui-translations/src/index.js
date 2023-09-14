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
        en: 'External Appointment',
        de: 'Externer Termin'
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
        en: 'T-Location',
        de: 'T-Location'
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
        internal: '_participationStatus_unknown',
        en: 'Unknown',
        de: 'Unbekannt',
    },
    {
        internal: '_participationStatus_participated',
        en: 'Participated',
        de: 'Teilgenommen',
    },
    {
        internal: '_participationStatus_didnt-participate',
        en: 'Did Not Participate',
        de: 'Nicht Teilgenommen',
    },
    {
        internal: '_participationStatus_showed-up-but-didnt-participate',
        en: 'Only Showed Up',
        de: 'Gekommen',
    },
    {
        internal: '_participationStatus_didnt-show-up',
        en: 'Did Not Show Up',
        de: 'Nicht Gekommen',
    },
    {
        internal: '_participationStatus_canceled-by-participant',
        en: 'Canceled by Participant',
        de: 'Abgesagt',
    },
    {
        internal: '_participationStatus_canceled-by-institute',
        en: 'Uninvited',
        de: 'Ausgeladen',
    },
    {
        internal: '_participationStatus_moved',
        en: 'Rescheduled',
        de: 'Verschoben',
    },
    {
        internal: '_participationStatus_deleted',
        en: 'Deleted',
        de: 'Gelöscht',
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
        de: 'Studienteilnahme'
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
        en: 'Condition',
        de: 'Bedingung'
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
        en: 'Subjects Found',
        de: 'Gefundene Proband:innen'
    },
    {
        internal: '_not_at_weekday',
        en: 'not on',
        de: 'nicht am'
    },
    {
        en: 'Location Comment',
        de: 'Location Kommentar'
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
        en: 'Create Appointment',
        de: 'Termin Eintragen'
    },
    {
        en: 'Edit Location Comment',
        de: 'Location-Kommentar Bearbeiten'
    },
    {
        en: 'Really cancel the appointment?',
        de: 'Den Termin wirklich absagen?'
    },
    {
        en: 'Cancel Appointment',
        de: 'Termin Absagen'
    },
    {
        en: 'No unconfirmed appointments on this day.',
        de: 'Keine unbestätigten Termine an diesem Tag.'
    },
    {
        en: 'Appointment Type',
        de: 'Termin-Typ'
    },
    {
        en: 'Unknown Appointment Type',
        de: 'Unbekannter Termin-Typ'
    },
    {
        en: 'Inhouse Appointment',
        de: 'Interner Termin'
    },
    {
        en: 'Online Video Appointment',
        de: 'Online-Video-Termin'
    },
    {
        en: 'Online Video Appointments',
        de: 'Online-Video-Termine'
    },
    {
        en: 'Edit Appointment Comment',
        de: 'Terminkommentar Bearbeiten'
    },
    {
        en: 'Appointment Comment', // FIXME: Appointment Comment is too long
        de: 'Terminkommentar'
    },
    {
        internal: '_appointment_comment',
        en: 'App. Comment', // FIXME: Appointment Comment is too long
        de: 'Terminkommentar'
    },
    {
        en: 'Reschedule Subject',
        de: 'Proband:in Verschieben'
    },
    {
        en: 'Reschedule To',
        de: 'Verschieben Auf'
    },
    {
        en: 'Unschedule Subject',
        de: 'Proband:in austragen'
    },
    {
        en: 'No Comment',
        de: 'Kein Kommentar'
    },
    {
        en: 'Subject Comment',
        de: 'Kommentar zu Proband:in'
    },
    {
        en: 'Reason',
        de: 'Grund'
    },
    {
        en: 'Block Subject',
        de: 'Proband:in Sperren'
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
        en: 'Reschedule Appointment',
        de: 'Termin Verschieben'
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
        en: 'No unprocessed appointments found.',
        de: 'Keine offenen Nachbereitungen gefunden.'
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
        en: 'Helper Table',
        de: 'Hilfstabelle'
    },
    {
        en: 'Edit Helper Table',
        de: 'Hilfstabelle Bearbeiten'
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
        en: 'Delete Helper Table',
        de: 'Hilfstabelle Löschen'
    },
    {
        en: 'There are still records in this helper table!',
        de: 'Es existieren noch Einträge in dieser Hilfstabelle!'
    },
    {
        en: 'Helper table is referenced by record type fields!',
        de: 'Hilfstabelle wird von Feldern in Datensatztypen referenziert!'
    },
    {
        en: 'Fields',
        de: 'Felder'
    },
    {
        en: 'Helper Table Deleted',
        de: 'Hilfstabelle Gelöscht'
    },
    {
        en: 'Helper table deleted succcessfully.',
        de: 'Hilfstabelle wurde erfolgreich gelöscht.'
    },
    {
        en: 'Edit Helper Table Item',
        de: 'Hilfstabellen-Eintrag Bearbeiten'
    },
    {
        en: 'Delete Helper Table Item',
        de: 'Hilfstabellen-Eintrag Löschen'
    },
    {
        en: 'Helper Table Item',
        de: 'Hilfstabellen-Eintrag'
    },
    {
        en: 'Helper table item is referenced by other records!',
        de: 'Hilfstabellen-Eintrag wird von anderen Datensätzen referenziert!'
    },
    {
        en: 'Helper table item deleted succcessfully.',
        de: 'Hilfstabellen-Entrag wurde erfolgreich gelöscht.'
    },
    {
        en: 'Helper Table Item Deleted',
        de: 'Hilfstabellen-Eintrag Gelöscht'
    },
    {
        en: 'New Helper Table',
        de: 'Neue Hilfstabelle'
    },
    {
        en: 'New Helper Table Item',
        de: 'Neuer Hilfstabellen-Eintrag'
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
        en: 'Past Appointments',
        de: 'Vergangene Termine'
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
        en: 'No past appointments found.',
        de: 'Keine vergangenen Termine gefunden.'
    },
    {
        en: 'In theese Studies',
        de: 'In diesen Studien'
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
        en: 'New Location',
        de: 'Neue Location'
    },
    {
        en: 'Appointments Not on',
        de: 'Neue Forschungsgruppe'
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
        en: 'Location Details',
        de: 'Location-Details'
    },
    {
        en: 'Edit Location',
        de: 'Location Bearbeiten'
    },
    {
        en: 'Hide Location',
        de: 'Location Ausblenden'
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
        en: 'Delete Location',
        de: 'Location Löschen'
    },
    {
        en: 'Location is referenced by other records!',
        de: 'Location wird von anderen Datensätzen referenziert!'
    },
    {
        en: 'Location Deleted',
        de: 'Location Gelöscht'
    },
    {
        en: 'Location was deleted successfully!',
        de: 'Location erfolgreich gelöscht!'
    },
    {
        en: 'New Subject',
        de: 'Neue Proband:in'
    },
    {
        en: 'Edit Subject',
        de: 'Proband:in Bearbeiten'
    },
    {
        en: 'Delete Subject',
        de: 'Proband:in Löschen'
    },
    {
        en: 'Subject Deleted',
        de: 'Proband:in Gelöscht'
    },
    {
        en: 'Subject was deleted successfully!',
        de: 'Proband:in erfolgreich gelöscht!'
    },
    {
        en: 'Subject is referenced by other records!',
        de: 'Proband:in wird von anderen Datensätzen referenziert!'
    },
    {
        en: 'Online ID Code',
        de: 'Online ID Code'
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
        en: 'Add to Appointment',
        de: 'In Termin Eintragen'
    },
    {
        en: 'Possible Studies',
        de: 'Mögliche Studien'
    },
    {
        en: 'No possible studies found.',
        de: 'Keine möglichen Studien gefunden.'
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
        en: 'Lab Workflow Settings',
        de: 'Ablauf-Einstellungen'
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
        en: 'Study Details',
        de: 'Studien-Details'
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
        en: 'Delete Study',
        de: 'Studie Löschen'
    },
    {
        en: 'Study is referenced by other records!',
        de: 'Studie wird von anderen Datensätzen referenziert!'
    },
    {
        en: 'Study was deleted successfully!',
        de: 'Studie wurde erfolgreich gelöscht!'
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
        en: 'Enabled Subject Types',
        de: 'Zugeordnete Proband:innentypen'
    },
    {
        en: 'No other studies are excluded',
        de: 'Keine anderen Studien ausgeschlossen'
    },
    {
        en: 'Excluded Studies',
        de: 'Studien-Ausschluss'
    },
    {
        en: 'No subject types with selection settings.',
        de: 'Keine Proband:innentypen mit Auswahlbedingungen.'
    },
    {
        en: 'Study Type',
        de: 'Studien-Typ'
    },
    {
        en: 'Subject Type',
        de: 'Proband:innen-Typ'
    },
    {
        en: 'Add Subject Type',
        de: 'Proband:innen-Typ hinzufügen'
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
        en: 'Delete Subject Type',
        de: 'Proband:innen-Typ Löschen'
    },
    {
        en: 'Really delete this subject type from the study?',
        de: 'Wirklich diesen Proband:innen-Typ aus dieser Studie löschen?'
    },
    {
        en: 'Please add at least one lab workflow.',
        de: 'Bitte mindestens einen Ablauf hinzufügen.'
    },
    {
        en: 'Lab Workflow Type',
        de: 'Ablauf-Typ'
    },
    {
        en: 'Add Lab Workflow',
        de: 'Ablauf hinzufügen'
    },
    {
        en: 'Please add settings for at least one subject type.',
        de: 'Bitte Einstellungen für mndestens einen Proband:innen-Typ hinzufügen.'
    },
    {
        en: 'Add Settings',
        de: 'Einstellungen hinzufügen'
    },
    {
        en: 'Lab Workflow',
        de: 'Ablauf'
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
        en: 'Appointments In',
        de: 'Termine In'
    },
    {
        en: 'Delete Settings',
        de: 'Einstellungen löschen'
    },
    {
        en: 'Delete Lab Workflow',
        de: 'Ablauf löschen'
    },
    {
        en: 'Really delete this lab workflow?',
        de: 'Diesen Ablauf wirklich löschen?'
    },
    {
        en: 'Really delete theese lab workflow settings?',
        de: 'Diese Ablauf-Einstellung wirklich löschen?'
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
        en: '${count} upcoming appointments',
        de: '${count} Termine in der Zukunft'
    },
    {
        en: '${count} unprocessed appointments',
        de: '${count} Termine die nicht nachbereitet wurden'
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
        en: 'mm/dd/yyyy',
        de: 'tt.mm.jjjj',
    },
    {
        internal: '_date_time_placeholder',
        en: 'mm/dd/yyyy --:-- am/pm',
        de: 'tt.mm.jjjj --:--',
    },
    {
        en: 'Permission',
        de: 'Berechtigung'
    },
    {
        internal: '_address_street',
        en: 'Street',
        de: 'Straße'
    },
    {
        internal: '_address_housenumber',
        en: 'Number',
        de: 'Nummer'
    },
    {
        internal: '_address_affix',
        en: 'Affix',
        de: 'Zusatz'
    },
    {
        internal: '_address_postcode',
        en: 'Postcode',
        de: 'PLZ'
    },
    {
        internal: '_address_city',
        en: 'City',
        de: 'Ort'
    },
    {
        internal: '_address_country',
        en: 'Country',
        de: 'Land'
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
        internal: '_phone_number',
        en: 'Number',
        de: 'Nummer'
    },
    {
        internal: '_phone_type_business',
        en: 'Business',
        de: 'Geschäftlich'
    },
    {
        internal: '_phone_type_private',
        en: 'Personal',
        de: 'Privat'
    },
    {
        internal: '_phone_type_mobile',
        en: 'Mobile',
        de: 'Mobil'
    },
    {
        internal: '_phone_type_fax',
        en: 'Fax',
        de: 'Fax'
    },
    {
        internal: '_phone_type_mother',
        en: 'Phone Mother',
        de: 'Tel. Mutter'
    },
    {
        internal: '_phone_type_father',
        en: 'Phone Father',
        de: 'Tel. Vater'
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
        internal: '_record_picker_placeholder',
        en: 'Select Record',
        de: 'Datensatz Auswählen'
    },
    {
        internal: '_record_picker_modal_title',
        en: 'Select Record',
        de: 'Datensatz Auswählen'
    },
    {
        internal: '_record_picker_change_button',
        en: 'Change Value',
        de: 'Wert Ändern'
    },
    {
        internal: '_record_picker_reset_button',
        en: 'Reset',
        de: 'Zurücksetzen',
    },
    {
        internal: '_form_array_moveup_button',
        en: 'Move Up',
        de: 'Nach Oben',
    },
    {
        internal: '_form_array_movedown_button',
        en: 'Move Down',
        de: 'Nach Unten',
    },
    {
        internal: '_form_array_remove_button',
        en: 'Remove',
        de: 'Entfernen',
    },
    {
        internal: '_form_array_add_button',
        en: 'New Item',
        de: 'Neuer Eintrag',
    },
    {
        en: 'Advanced Subject Search',
        de: 'Erweiterte Proband:innen-Suche',
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
        de: 'Regebnisliste',
    },
    {
        en: 'Internal ID',
        de: 'Interne ID',
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
        en: 'Not with theese Values',
        de: 'Nicht mit diesen Werten',
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
        en: 'Advanced Study Search',
        de: 'Erweiterte Studien-Suche',
    },
    {
        en: 'Column',
        de: 'Spalte'
    },
    {
        en: 'Advanced Location Search',
        de: 'Erweiterte Location-Suche',
    },

    {
        en: 'Can Reserve Rooms',
        de: 'Kann Räumlichkeiten Reservieren',
    },
    {
        en: 'Can Select Subjects for Appointments',
        de: 'Kann Proband:innen für Termine Auswählen',
    },
    {
        en: 'Can Confirm Appointments',
        de: 'Kann Termine Bestätigen',
    },
    {
        en: 'Can View Appointment Calendar',
        de: 'Kann Terminkalender Einsehen',
    },
    {
        en: 'Can Move and Cancel Appointments',
        de: 'Kann Termine Verschieben und Absagen',
    },
    {
        en: 'Can Change Experimenter Teams',
        de: 'Kann Experimenter:innen-Teams Ändern',
    },
    {
        en: 'Can Postprocess Appointments',
        de: 'Kann Termine Nachbereiten',
    },

    {
        en: 'Can Schedule Experimenter Teams',
        de: 'Kann Experimenter:innen-Teams Planen',
    },
    {
        en: 'Can Change Study of Existing Appointments',
        de: 'Kann Studie von Existierenden Terminen Ändern',
    },
    {
        en: 'Can Remove Subjects from Existing Appointments',
        de: 'Kann Proband:innen aus Existierenden Terminen Entfernen',
    },
    {
        en: 'Can Carry Out Only Surveys',
        de: 'Kann Online-Umfragen Durchführen',
    },

    {
        en: 'Can View Locations (Kigas, Rooms, etc.)',
        de: 'Kann Locations Einsehen (Kigas, Räume, etc.)',
    },
    {
        en: 'Can Edit Locations (Kigas, Rooms, etc.)',
        de: 'Kann Locations Bearbeiten (Kigas, Räume, etc.)',
    },
    {
        en: 'Can Delete Locations (Kigas, Rooms, etc.)',
        de: 'Kann Locations Löschen (Kigas, Räume, etc.)',
    },
    {
        en: 'Can View External Persons (e.g. Doctors)',
        de: 'Kann Externe Personen Einsehen (e.g. Ärzte)',
    },
    {
        en: 'Can Edit External Persons (e.g. Doctors)',
        de: 'Kann Externe Personen Bearbeiten (e.g. Ärzte)',
    },
    {
        en: 'Can Delete External Persons (e.g. Doctors)',
        de: 'Kann Externe Personen Löschen (e.g. Ärzte)',
    },
    {
        en: 'Can View External Organizations (e.g. Kiga Umbrella Orgs)',
        de: 'Kann Externe Organisationen Einsehen (e.g. Kiga-Träger)',
    },
    {
        en: 'Can Edit External Organizations (e.g. Kiga Umbrella Orgs)',
        de: 'Kann Externe Organisationen Bearbeiten (e.g. Kiga-Träger)',
    },
    {
        en: 'Can Delete External Organizations (e.g. Kiga Umbrella Orgs)',
        de: 'Kann Externe Organisationen Löschen (e.g. Kiga-Träger)',
    },
    {
        en: 'Can View Study Topics',
        de: 'Kann Themengebiete Einsehen',
    },
    {
        en: 'Can Edit Study Topics',
        de: 'Kann Themengebiete Bearbeiten',
    },
    {
        en: 'Can Delete Study Topics',
        de: 'Kann Themengebiete Löschen',
    },
    {
        en: 'Can View Helper Tables',
        de: 'Kann Hilfstabellen Einsehen',
    },
    {
        en: 'Can Edit Helper Tables',
        de: 'Kann Hilfstabellen Bearbeiten',
    },
    {
        en: 'Can Delete Helper Tables',
        de: 'Kann Hilfstabellen Löschen',
    },

    {
        en: 'Can View Staff Members (i.e. User Accounts)',
        de: 'Kann Mitarbeiter:innen Einsehen (d.h. Benutzer-Accounts)',
    },
    {
        en: 'Can Edit Staff Members (i.e. User Accounts)',
        de: 'Kann Mitarbeiter:innen Bearbeiten (d.h. Benutzer-Accounts)',
    },
    {
        en: 'Can Grant and Revoke Staff Members Log-In Permission',
        de: 'Kann Mitarbeiter:innen Login-Erlaubnis Gewähren und Entziehen'
    },
    {
        en: 'Can Set Password of Other Staff Members',
        de: 'Kann Passwort Anderer Mitarbeiter:innen Neusetzen'
    },
    {
        en: 'Can View Studies',
        de: 'Kann Studien Einsehen',
    },
    {
        en: 'Can Edit Studies',
        de: 'Kann Studien Bearbeiten',
    },
    {
        en: 'Can Delete Studies',
        de: 'Kann Studien Löschen',
    },
    {
        en: 'Can View Subjects',
        de: 'Kann Proband:innen Einsehen',
    },
    {
        en: 'Can Edit Subjects',
        de: 'Kann Proband:innen Bearbeiten',
    },
    {
        en: 'Can Delete Subjects',
        de: 'Kann Proband:innen Löschen',
    },
    {
        en: 'Can View Study Participation',
        de: 'Kann Studienteilnahme Einsehen',
    },
    {
        en: 'Can Add Study Participations Manually',
        de: 'Kann Studienteilnahmen Manuell Hinzufügen',
    },
    {
        en: 'Can Reserve Rooms/Teams Within the Next 3 Days',
        de: 'Kann Räume/Teams Innerhalb der Nächsten 3 Tage Reservieren',
    },
    {
        en: 'Can Make Appointments Within the Next 3 Days',
        de: 'Kann Termine Innerhalb der Nächsten 3 Tage Machen',
    },
    {
        en: 'Can Use Advanced Search',
        de: 'Kann Erweiterte Suche Benutzen',
    },
    {
        en: 'Can Use CSV Export',
        de: 'Kann CSV-Export Benutzen',
    },
    {
        en: 'Can View Receptionist Calendar',
        de: 'Kann Rezeptionskalender einsehen',
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
        de: 'Fehlerhafete Eingaben'
    },
    {
        internal: '_XXX_system-error',
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
        en: 'General Permissions',
        de: 'Allgemeine Berechtigungen'
    },
    {
        en: 'Scheduling General',
        de: 'Terminierung Allgemein'
    },
    {
        en: 'Advanced Functions',
        de: 'Erweiterte Funktionen'
    },
    {
        en: 'Lab Workflow Related Permissions',
        de: 'Ablaufbezogene Berechtigungen'
    },


    {
        en: 'New Record Type',
        de: 'Neuer Datensatz-Typ'
    },
    {
        en: 'Collection',
        de: 'Collection'
    },
    {
        en: 'Display Name',
        de: 'Anzeigename'
    },
    {
        en: 'Internal Type Key',
        de: 'Interner Type-Key'
    },
    {
        en: 'The internal type key is generated automatically based on the display name but can be overridden manually.',
        de: 'Der Interne Type-Key wird automatisch anhand des Anzeigenamens generiert kann aber manuell überschrieben werden.'
    },
    {
        en: 'Delete Record Type',
        de: 'Datensatz-Typ Löschen'
    },
    {
        en: 'Record Type',
        de: 'Datensatz-Typ'
    },
    {
        en: 'There are still records of this record type!',
        de: 'Es gibt noch Datensätze mit diesem Datensatz-Typ'
    },
    {
        en: 'This record type is referenced in fields of other record types!',
        de: 'Dieser Datensatz-Typ wird von Feldern anderer Datensatz-Typen referenziert!'
    },
    {
        en: 'Record Type Deleted',
        de: 'Datensatz-Typ Gelöscht'
    },
    {
        en: 'Record type was deleted successfully!',
        de: 'Datensatz-Typ wurde erfolgreich gelöscht!'
    },
    {
        en: 'Record not found!',
        de: 'Datensatz nicht gefunden!'
    },
    {
        en: 'Live Settings',
        de: 'Live-Settings'
    },
    {
        en: 'Field Editor',
        de: 'Feld-Editor'
    },
    {
        en: 'Uncommited Field Changes',
        de: 'Unfixierte Feldänderungen'
    },
    {
        internal: '_crt_uncommited_fields_hint',
        en: 'The record type contains uncommited field changes! They have to be commited in the field editor before they are available in live settings and in records of this type.',
        de: 'Der Datensatz-Typ enthält unfixierte Feldänderungen! Diese müssen im Feld-Editor fixiert werden, bevor sie in den Live-Settings und in den Datensätzen dieses Datensatz-Types verfügbar sind.'
    },
    {
        en: 'General Settings',
        de: 'Allgemeine Einstellungen'
    },
    {
        en: 'Short Label when Referencing',
        de: 'Kurzanzeige bei Referenzierung'
    },
    {
        en: 'Field Order in Forms',
        de: 'Feldreihenfolge in Formularen'
    },
    {
        en: 'Columns (General)',
        de: 'Tabellenspalten (Allgemein)'
    },
    {
        en: 'Columns (Option Select)',
        de: 'Tabellenspalten (Optionssauswahl)'
    },
    {
        en: 'Extra Fields for Summary',
        de: 'Extra Felder für Zusammenfassung'
    },
    {
        en: 'Extra Columns for Subject Selection (Inhouse/Video)',
        de: 'Extra Spalten bei Proband:innen-Auswahl (Intern/Video)'
    },
    {
        en: 'Extra Columns for Subject Selection (External)',
        de: 'Extra Spalten bei Proband:innen-Auswahl (Extern)'
    },
    {
        en: 'Fields for Duplication Check',
        de: 'Felder für Duplikatsprüfung'
    },
    {
        en: 'Requires Participation Permissions',
        de: 'Benötigt Teilnahmeerlaubnis'
    },
    {
        en: 'Comment Field Requires Extra Permission',
        de: 'Kommentarfeld Benötigt Extra Berechtigung'
    },
    {
        en: 'Show ID No.',
        de: 'ID Nr. Anzeigen'
    },
    {
        en: 'Show Online ID Code',
        de: 'Online-ID-Code Anzeigen'
    },
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
        en: 'No display fields set.',
        de: 'Keine Anzeigefelder festgelegt.'
    },
    {
        en: 'Field Order',
        de: 'Feld Reihenfolge'
    },
    {
        en: 'New Field',
        de: 'Neues Feld'
    },
    {
        en: 'Commit Fields',
        de: 'Felder Fixieren'
    },
    {
        en: 'Internal Key',
        de: 'Interner Key'
    },
    {
        en: 'Data Channel',
        de: 'Datenkanal'
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
        en: 'New Field',
        de: 'Neues Feld'
    },
    {
        en: 'Please select field type!',
        de: 'Bitte Feld-Typ auswählen!'
    },
    {
        en: 'Default',
        de: 'Standard'
    },
    {
        en: 'Data Protection (GDPR)',
        de: 'Datenschutz (DSGVO)'
    },
    {
        en: 'Minimul Number',
        de: 'Mindestanzahl'
    },
    {
        en: 'Character (Minimum)',
        de: 'Zeichen (Mindestens)'
    },
    {
        en: 'Optional',
        de: 'Optional'
    },
    {
        en: 'Age Range Anchor',
        de: 'Altersfenster-Referenz'
    },
    {
        en: 'Main Table',
        de: 'Haupt-Tabelle'
    },
    {
        en: 'Constraint',
        de: 'Constraint'
    },
    {
        en: 'Empty as "Unknown"',
        de: 'Leer als "Unbekannt"'
    },
    {
        en: 'Field Type',
        de: 'Feld-Typ'
    },

    {
        internal: '_fieldtype_SaneString',
        en: 'One Line Variable Text',
        de: 'Freitext einzelig',
    },
    {
        internal: '_fieldtype_FullText',
        en: 'Multi Line Variable Text',
        de: 'Freitext mehrzeilig',
    },
    {
        internal: '_fieldtype_Integer',
        en: 'Integer Number',
        de: 'Ganz-Zahl',
    },
    {
        internal: '_fieldtype_DefaultBool',
        en: 'Yes / No',
        de: 'Ja / Nein',
    },
    {
        internal: '_fieldtype_ExtBool',
        en: 'Yes / No / Unknown',
        de: 'Ja /Nein / Unbekannt',
    },
    {
        internal: '_fieldtype_DateTime',
        en: 'Date + Time',
        de: 'Datum + Zeit',
    },
    {
        internal: '_fieldtype_DateOnlyServerSide',
        en: 'Date with Server Timezone',
        de: 'Datum mit Server-Zeitzone',
    },
    {
        internal: '_fieldtype_HelperSetItemId',
        en: 'Item from Helper Table',
        de: 'Eintrag aus Hilfs-Tabelle',
    },
    {
        internal: '_fieldtype_HelperSetItemIdList',
        en: 'List of Items from Helper Table',
        de: 'Liste von Einträgen aus Hilfs-Tabelle',
    },
    {
        internal: '_fieldtype_ForeignId',
        en: 'Record from a Main Table',
        de: 'Eintrag aus anderer Haupt-Tabellen',
    },
    {
        internal: '_fieldtype_ForeignIdList',
        en: 'List of Records from a Main Table',
        de: 'Liste von Einträgen aus anderer Haupt-Tabelle',
    },
    {
        internal: '_fieldtype_Address',
        en: 'Address',
        de: 'Adresse',
    },
    {
        internal: '_fieldtype_GeoCoords',
        en: 'Geo Coordinates',
        de: 'Geo-Koordinaten',
    },
    {
        internal: '_fieldtype_BiologicalGender',
        en: 'Biological Gender',
        de: 'Geschlecht',
    },
    {
        internal: '_fieldtype_Email',
        en: 'E-Mail Address',
        de: 'E-Mail-Adresse',
    },
    {
        internal: '_fieldtype_EmailList',
        en: 'List of E-Mail Addresses',
        de: 'Liste von E-Mail-Adressen',
    },
    {
        internal: '_fieldtype_Phone',
        en: 'Phone Number',
        de: 'Telefonnummer',
    },
    {
        internal: '_fieldtype_PhoneList',
        en: 'List of Phone Numbers',
        de: 'Liste von Telefonnummern',
    },
    {
        internal: '_fieldtype_PhoneWithTypeList',
        en: 'List of Phone Numbers with Type',
        de: 'Liste von Telefonnummern mit Typ',
    },
    {
        internal: '_fieldtype_ListOfObjects',
        en: 'User Defined Sub List',
        de: 'Benutzerdefinierte Unterliste',
    },
    {
        internal: '_fieldtype_Lambda',
        en: 'Dynamic Calculation',
        de: 'Dynamische Berechnung',
    }
]

export const createTranslate = (lang = 'en') => {
    var translate = (template, props) => {
        var map = maps.find(it => (
            it.internal === template || it.en === template
        ));

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

    translate.options = (options) => (
        Object.keys(options).reduce((acc, key) => ({
            ...acc, [key]: translate(options[key])
        }), {})
    );

    // FIXME: that dsoenst work with GenericEnum
    // and simply shallow cloning doenst wont work either i think
    // maybe we can add mapping prop
    //translate.enum = (enumeration) => {
    //    return {
    //        keys: enumeration.keys,
    //        labels: enumeration.labels.map(it => translate(label))
    //    }
    //};

    return translate;
}
