'use strict';
var { DefaultBool } = require('@mpieva/psydb-schema-fields');

module.exports = {
    canReadStudies: DefaultBool({
        title: 'kann Studien einsehen',
    }),
    canWriteStudies: DefaultBool({
        title: 'kann Studien anlegen und bearbeiten',
    }),
}
