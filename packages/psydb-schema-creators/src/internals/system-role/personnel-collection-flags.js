'use strict';
var WideBool = require('./wide-bool');

module.exports = {
    canReadPersonnel: WideBool({
        title: 'kann Mitarbeiter:in einsehen (d.h. Benutzer-Accounts)',
    }),
    canWritePersonnel: WideBool({
        title: 'kann Mitarbeiter:in bearbeiten (d.h. Benutzer-Accounts)',
    }),
}
