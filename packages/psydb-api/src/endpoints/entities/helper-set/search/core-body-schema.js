'use strict';
var {
    ExactObject,
    Id,
    IdentifierString,
    JsonPointer,
    DefaultBool
} = require('@mpieva/psydb-schema-fields');

var CoreBodySchema = () => ({
    type: 'object',
    properties: {
        target: {
            type: 'string',
            enum: [ 'table', 'optionlist' ]
        },
        showHidden: DefaultBool(),
    },
    required: []
});

module.exports = CoreBodySchema;
