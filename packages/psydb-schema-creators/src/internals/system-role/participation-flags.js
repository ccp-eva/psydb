'use strict';
var inline = require('@cdxoo/inline-text');
var WideBool = require('./wide-bool');

module.exports = {
    canReadParticipation: WideBool({
        title: inline`
            kann einsehen welche Proband:innen
            an einer Studie telgenommen haben
        `
    }),
    canWriteParticipation: WideBool({
        title: 'kann manuell Proband:innen in eine Studie eintragen'
    }),
}
