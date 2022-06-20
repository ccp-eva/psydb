'use strict';
var WideBool = require('./wide-bool');

module.exports = {
    canReadExternalPersons: WideBool({
        title: 'kann Externe Personen einsehen (z.B. Ärzte)'
    }),
    canWriteExternalPersons: WideBool({
        title: 'kann Externe Personen bearbeiten (z.B. Ärzte)'
    }),
}
