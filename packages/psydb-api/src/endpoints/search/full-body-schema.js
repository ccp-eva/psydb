'use strict';
var psydbSchemaFields = require('@mpieva/psydb-schema-fields');

var {
    ExactObject,
    Id,
    IdentifierString,
    JsonPointer,
} = psydbSchemaFields;

var metadata = require('./field-type-metadata');

var FullBodySchema = ({ availableFilterFields }) => {

    console.log(availableFilterFields);

    //var variants = [];
    var filters = {};
    for (var field of availableFilterFields) {
        var { systemType, dataPointer } = field;
        var {
            canSearch,
            searchType
        } = metadata[systemType];

        if (canSearch) {
            var realType = searchType || systemType;
            var FieldSchema = psydbSchemaFields[realType];
            
            /*variants.push(ExactObject({
                properties: {
                    dataPointer: { const: dataPointer },
                    // FIXME: props needed i guess
                    // are stored in custom field settings
                    // can be mapped
                    value: FieldSchema()
                },
                required: [
                    'dataPointer',
                    'value',
                ],
            }))*/

            // FIXME: props needed i guess
            // are stored in custom field settings
            // can be mapped
            filters[dataPointer] = FieldSchema();
        }
    }

    return ExactObject({
        properties: {
            collectionName: IdentifierString(),
            recordType: IdentifierString(), // FIXME: enum
            /*filters: {
                type: 'array',
                // TODO: the idea is to push/pull empty values
                // or when the user clicks reset on the search field
                // alternatively we could also
                // use { [dataPointer]: { ... value }} and strip empty
                // nut sure here, might get wonky with wierd keys /foo/bar/baz
                items: { oneOf: variants }
            },*/
            filters: ExactObject({
                properties: filters,
                required: [],
            }),
            offset: {
                type: 'integer',
                minimum: 0,
            },
            limit: {
                type: 'integer',
                minimum: 1,
                maximum: 100,
            }
        },
        required: [
            'collectionName',
            'filters',
            'offset',
            'limit',
        ]
    });
};

module.exports = FullBodySchema;
