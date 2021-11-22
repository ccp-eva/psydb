'use strict';
var inline = require('@cdxoo/inline-text');
var WideBool = require('./wide-bool');

module.exports = {
    canReadSubjects: WideBool({
        title: 'kann Studien einsehen',
    }),
    canWriteSubjects: WideBool({
        title: 'kann Studien anlegen und bearbeiten',
    }),
}
