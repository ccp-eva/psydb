'use strict';
var {
    ExactObject, DefaultArray,
    IdentifierString, StringEnum
} = require('@mpieva/psydb-schema-fields');

var {
    Sort: SimpleMongodbSort
} = require('@mpieva/psydb-schema-fields-special');

var FullBodySchema = (bag) => {
    var { availableFields } = bag;

    var schema = ExactObject({
        properties: {
            'recordType': IdentifierString(), // FIXME: enum
            'inspectedPointers': DefaultArray({
                minItems: 1,
                items: StringEnum([
                    ...availableFields.map(it => it.pointer)
                ])
            }),
            'sort': SimpleMongodbSort(),
        },
        required: [
            'recordType',
            'inspectedPointers'
        ]
    });

    return schema;
}

module.exports = FullBodySchema;
