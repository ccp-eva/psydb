'use strict';
var inline = require('@cdxoo/inline-text');
var WideBool = require('./wide-bool');

module.exports = {
    canWriteAdministrativeCollections: WideBool({
        title: inline`
            kann administrative Datensätze bearbeiten
            (d.h. Kigas, Räume, Hilfstabellen, etc.)
        `,
    }),
    canWritePersonnel: WideBool({
        title: inline`
            kann Mitarbeiter bearbeiten (d.h. Benutzer-Accounts)
        `,
    }),
    canSetPersonnelPassword: WideBool({
        title: inline`
            kann das Passwort anderer Benutzer manuell neu setzen
        `,
    }),
    /*canUseComplexSubjectSearch: WideBool({
        title: 'kann die erweiterte Probandensuche benutzen',
    })*/
}
