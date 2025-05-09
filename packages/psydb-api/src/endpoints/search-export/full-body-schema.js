'use strict';
var psydbSchemaFields = require('@mpieva/psydb-schema-fields');

var {
    BasicObject,
    ExactObject,
    Id,
    IdentifierString,
    JsonPointer,
    DefaultBool,
    Timezone,
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
            collection: IdentifierString(),
            recordType: IdentifierString(), // FIXME: enum
            searchOptions: ExactObject({
                properties: {
                    enableResearchGroupFilter: DefaultBool({ default: true })
                },
                required: []
            }),
            /*filters: {
                type: 'array',
                // TODO: the idea is to push/pull empty values
                // or when the user clicks reset on the search field
                // alternatively we could also
                // use { [dataPointer]: { ... value }} and strip empty
                // nut sure here, might get wonky with wierd keys /foo/bar/baz
                items: { oneOf: variants }
            },*/
            showHidden: DefaultBool(),

            filters: ExactObject({
                properties: filters,
                required: [],
            }),
            constraints: BasicObject({
                ...availableConstraints
            }),
            sort: ExactObject({
                properties: {
                    path: {
                        type: 'string',
                        minLength: 1,
                    },
                    direction: {
                        type: 'string',
                        enum: [ 'asc', 'desc' ]
                    }
                },
                required: [ 'path', 'direction' ]
            }),


            timezone: Timezone(),
        },
        required: [
            'collection',
            'filters',
        ]
    });

    //console.dir(schema, { depth: null })

    return schema;
};

module.exports = FullBodySchema;
