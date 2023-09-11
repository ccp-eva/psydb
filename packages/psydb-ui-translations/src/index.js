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
        en: 'Unknown Appointment Type',
        de: 'Unbekannter Termintyp'
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
