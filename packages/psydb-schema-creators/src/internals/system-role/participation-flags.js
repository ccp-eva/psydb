'use strict';
var inline = require('@cdxoo/inline-text');

var {
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

module.exports = {
    canReadParticipation: Default({
        title: inline`
            kann einsehen welche Probanden
            an einer Studie telgenommen haben
        `
    }),
    canWriteParticipation: Default({
        title: 'kann manuell Probanden in eine Studie eintragen'
    }),
}
