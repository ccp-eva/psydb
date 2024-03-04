'use strict';
var {
    ExactObject,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

module.exports = () => ExactObject({
    properties: {
        timezone: { type: 'string' }
    },
    required: []
})
