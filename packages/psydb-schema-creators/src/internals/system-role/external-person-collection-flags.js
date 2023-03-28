'use strict';
var WideBool = require('./wide-bool');

module.exports = {
    canReadExternalPersons: WideBool(),
    canWriteExternalPersons: WideBool(),
    canRemoveExternalPersons: WideBool(),
}
