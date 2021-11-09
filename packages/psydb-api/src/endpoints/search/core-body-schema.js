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
        collectionName: IdentifierString(),
        recordType: IdentifierString(), // FIXME: enum
        searchOptions: ExactObject({
            properties: {
                enableResearchGroupFilter: DefaultBool({ default: true })
            },
            required: []
        }),
        target: {
            type: 'string',
            enum: [ 'table', 'optionlist' ]
        }
    },
    required: [
        'collectionName',
    ]
});

module.exports = CoreBodySchema;
