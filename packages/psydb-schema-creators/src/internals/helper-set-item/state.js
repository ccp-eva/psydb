'use strict';
var {
    ExactObject,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var HelperSetItemState = () => ExactObject({
    properties: {
        label: SaneString(),
    },
    required: [
        'label',
    ]
})

module.exports = HelperSetItemState;

