'use strict';
var inline = require('@cdxoo/inline-text');
var WideBool = require('./wide-bool');

module.exports = {
    canReadSubjects: WideBool({
        title: 'kann Proband:innen einsehen',
    }),
    canWriteSubjects: WideBool({
        title: 'kann Proband:innen anlegen und bearbeiten',
    }),
    canRemoveSubjects: WideBool({
        title: 'kann Proband:innen löschen',
    }),
}
