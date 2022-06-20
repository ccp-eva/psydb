'use strict';
var WideBool = require('./wide-bool');

module.exports = {
    canReadExternalOrganizations: WideBool({
        title: 'kann Externe Organisationen einsehen (z.B. Träger)'
    }),
    canWriteExternalOrganizations: WideBool({
        title: 'kann Externe Organisationen bearbeiten (z.B. Träger)'
    }),
}
