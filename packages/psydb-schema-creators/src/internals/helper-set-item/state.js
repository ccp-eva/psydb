'use strict';
var {
    ExactObject,
    OpenObject,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var HelperSetItemState = () => ExactObject({
    properties: {
        label: SaneString({ minLength: 1 }),
        displayNameI18N: OpenObject({
            de: SaneString()
        })
    },
    required: [
        'label',
        'displayNameI18N',
    ]
})

module.exports = HelperSetItemState;

