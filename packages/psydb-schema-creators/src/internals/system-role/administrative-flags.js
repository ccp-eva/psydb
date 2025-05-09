'use strict';
var inline = require('@cdxoo/inline-text');
var WideBool = require('./wide-bool');

module.exports = {
    canAllowLogin: WideBool(),
    canSetPersonnelPassword: WideBool(),
    canUseExtendedSearch: WideBool({
        title: 'kann die Erweiterte Suche benutzen',
    }),
    canUseCSVExport: WideBool({
        title: inline`
            kann CSV-Export benutzen
        `,
    }),
    canCreateReservationsWithinTheNext3Days: WideBool({
        title: inline`
            kann Räume/Teams innerhalb der nächsten 3 Tage reservieren
        `,
    }),
    canCreateExperimentsWithinTheNext3Days: WideBool({
        title: inline`
            kann Termine innerhalb der nächsten 3 Tage machen
        `,
    }),
    canViewStudyLabOpsSettings: WideBool({
        title: inline`
            kann Ablauf-Einstellungen von Studien einsehen
        `,
    }),
    canAccessSensitiveFields: WideBool({
        title: inline`
            kann sensible Felder einsehen (z.B. WKPRC-Kommentar)
        `,
    })
}
