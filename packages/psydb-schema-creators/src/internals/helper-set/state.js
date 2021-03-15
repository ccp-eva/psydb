'use strict';
var {
    ExactObject,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var HelperSetState = () => ExactObject({
    properties: {
        label: SaneString(),
    },
    required: [
        'label',
    ]
})

module.exports = HelperSetState;

