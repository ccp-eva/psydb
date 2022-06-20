'use strict';
var WideBool = require('./wide-bool');

module.exports = {
    canReadPersonnel: WideBool({
        title: 'kann Mitarbeiter einsehen (d.h. Benutzer-Accounts)',
    }),
    canWritePersonnel: WideBool({
        title: 'kann Mitarbeiter bearbeiten (d.h. Benutzer-Accounts)',
    }),
}
