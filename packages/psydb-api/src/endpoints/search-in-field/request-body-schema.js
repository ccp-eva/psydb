'use strict';
var {
    ExactObject,
    Id,
    IdentifierString,
    JsonPointer,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        contextCollectionName: IdentifierString(),
        contextRecordId: Id(),
        fieldPointer: JsonPointer(),
        additionalFilter: {
            type: 'object',
        }
    },
    required: [
        'contextCollectionName',
        'contextRecordId',
        'fieldPointer',
        'additionalFilter',
    ]
});

module.exports = RequestBodySchema;
