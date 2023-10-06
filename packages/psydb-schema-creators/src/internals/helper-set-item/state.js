'use strict';
var {
    ClosedObject,
    MaxObject,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var HelperSetItemState = () => ClosedObject({
    label: SaneString({ minLength: 1 }),
    displayNameI18N: MaxObject({
        de: SaneString()
    })
})

module.exports = HelperSetItemState;

