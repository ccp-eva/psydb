'use strict';
var inline = require('@cdxoo/inline-text');
var { DefaultBool } = require('@mpieva/psydb-schema-fields');

module.exports = {
    canWriteAdministrativeCollections: DefaultBool({
        title: inline`
            kann administrative Datensätze bearbeiten
            (d.h. Kindergärten, Räume, Träger, Hilfstabellen, etc.)
        `,
    }),
    canWritePersonnel: DefaultBool({
        title: inline`
            kann Mitarbeiter bearbeiten (d.h. Benutzer-Accounts)
        `,
    }),
    canSetPersonnelPassword: DefaultBool({
        title: inline`
            kann das Passwort anderer Benutzer manuell neu setzen
        `,
    }),
    /*canUseComplexSubjectSearch: DefaultBool({
        title: 'kann die erweiterte Probandensuche benutzen',
    })*/
}
