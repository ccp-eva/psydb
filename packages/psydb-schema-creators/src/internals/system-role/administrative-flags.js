'use strict';
var inline = require('@cdxoo/inline-text');
var WideBool = require('./wide-bool');

module.exports = {
    // TODO: OBSOLETE
    canWriteAdministrativeCollections: WideBool({
        title: inline`
            OBSOLETE - kann administrative Datensätze bearbeiten
        `,
    }),

    canWriteLocations: WideBool({
        title: 'kann Locations bearbeiten (Kigas, Räume, etc.)'
    }),
    canWriteExternalPersons: WideBool({
        title: 'kann Externe Personen bearbeiten (z.B. Ärzte)'
    }),
    canWriteExternalOrganizations: WideBool({
        title: 'kann Externe Organisationen bearbeiten (z.B. Träger)'
    }),
    canWriteStudyTopics: WideBool({
        title: 'kann Themengebiete bearbeiten'
    }),
    canWriteHelperSets: WideBool({
        title: 'kann Hilfstabellen bearbeiten'
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
