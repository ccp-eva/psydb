'use strict';
var inline = require('@cdxoo/inline-text');
var WideBool = require('./wide-bool');

module.exports = {
    canReadSubjects: WideBool({
        title: 'kann Probanden einsehen',
    }),
    canWriteSubjects: WideBool({
        title: 'kann Probanden anlegen und bearbeiten',
    }),
}
