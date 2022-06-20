'use strict';
var inline = require('@cdxoo/inline-text');
var WideBool = require('./wide-bool');

module.exports = {
    canSetPersonnelPassword: WideBool({
        title: inline`
            kann das Passwort anderer Benutzer manuell neu setzen
        `,
    }),
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
}
