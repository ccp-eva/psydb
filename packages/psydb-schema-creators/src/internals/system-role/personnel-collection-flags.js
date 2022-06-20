'use strict';
var WideBool = require('./wide-bool');

module.exports = {
    canReadPersonnel: WideBool({
        title: 'kann Mitarbeiter:innen einsehen (d.h. Benutzer-Accounts)',
    }),
    canWritePersonnel: WideBool({
        title: 'kann Mitarbeiter:innen bearbeiten (d.h. Benutzer-Accounts)',
    }),
}
