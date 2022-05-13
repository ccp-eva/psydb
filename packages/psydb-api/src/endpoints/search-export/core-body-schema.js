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
        collection: IdentifierString(),
        recordType: IdentifierString(), // FIXME: enum
        searchOptions: ExactObject({
            properties: {
                enableResearchGroupFilter: DefaultBool({ default: true })
            },
            required: []
        }),
    },
    required: [
        'collection',
    ]
});

module.exports = CoreBodySchema;
