'use strict';
var {
    ExactObject,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var HelperSetItemState = () => ExactObject({
    properties: {
        label: SaneString({
            title: 'Bezeichnung',
        }),
    },
    required: [
        'label',
    ]
})

module.exports = HelperSetItemState;

