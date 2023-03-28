'use strict';
var WideBool = require('./wide-bool');

module.exports = {
    canReadExternalOrganizations: WideBool(),
    canWriteExternalOrganizations: WideBool(),
    canRemoveExternalOrganizations: WideBool(),
}
