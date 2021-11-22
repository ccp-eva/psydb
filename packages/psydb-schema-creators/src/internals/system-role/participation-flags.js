'use strict';
var inline = require('@cdxoo/inline-text');
var WideBool = require('./wide-bool');

module.exports = {
    canReadParticipation: WideBool({
        title: inline`
            kann einsehen welche Probanden
            an einer Studie telgenommen haben
        `
    }),
    canWriteParticipation: WideBool({
        title: 'kann manuell Probanden in eine Studie eintragen'
    }),
}
