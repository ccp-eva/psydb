'use strict';
var inline = require('@cdxoo/inline-text');

var {
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

module.exports = {
    canReadSubjects: DefaultBool({
        title: 'kann Studien einsehen',
    }),
    canWriteStudies: DefaultBool({
        title: 'kann Studien anlegen und bearbeiten',
    }),
}
