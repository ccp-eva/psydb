'use strict';
var {
    ExactObject,
    Id,
    IdentifierString,
    JsonPointer,
} = require('@mpieva/psydb-schema-fields');

var CoreBodySchema = () => ({
    type: 'object',
    properties: {
        collectionName: IdentifierString(),
        recordType: IdentifierString(), // FIXME: enum
        target: {
            type: 'string',
            enum: [
                'table',
                'optionlist',
            ]
        }
    },
    required: [
        'collectionName',
    ]
});

module.exports = CoreBodySchema;
