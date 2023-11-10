'use strict';
var WideBool = require('./wide-bool');

module.exports = {
    canReadSubjectGroups: WideBool(),
    canWriteSubjectGroups: WideBool(),
    canRemoveSubjectGroups: WideBool(),
}
