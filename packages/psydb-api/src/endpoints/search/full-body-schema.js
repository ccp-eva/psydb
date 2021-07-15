'use strict';
var psydbSchemaFields = require('@mpieva/psydb-schema-fields');

var {
    BasicObject,
    ExactObject,
    Id,
    IdentifierString,
    JsonPointer,
} = psydbSchemaFields;

var metadata = require('@mpieva/psydb-common-lib/src/field-type-metadata');

var FullBodySchema = ({
    availableConstraints,
    availableFilterFields
}) => {

    //var variants = [];
    var filters = {};
    for (var field of availableFilterFields) {
        var { systemType, dataPointer } = field;
        var {
            canSearch,
            searchType,
            searchDisplayType,
        } = metadata[systemType];

        if (canSearch) {
            var realType = searchDisplayType || searchType || systemType;
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
            // FIXME: on foreign id ... do we need collection and other props here?
            filters[dataPointer] = FieldSchema({ collection: '__NONE' });
        }
    }

    var schema = ExactObject({
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
            constraints: BasicObject({
                ...availableConstraints
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

    //console.dir(schema, { depth: null })

    return schema;
};

module.exports = FullBodySchema;
