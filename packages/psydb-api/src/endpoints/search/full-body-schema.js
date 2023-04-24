'use strict';
var psydbSchemaFields = require('@mpieva/psydb-schema-fields');

var {
    BasicObject,
    ExactObject,
    Id,
    IdList,
    IdentifierString,
    JsonPointer,
    DefaultBool,
    StringEnum,
} = psydbSchemaFields;

var metadata = require('@mpieva/psydb-common-lib/src/field-type-metadata');

var {
    SearchFilters,
    SearchConstraints,
    Pagination,
    Sort,
} = require('@mpieva/psydb-schema-fields-special');

var FullBodySchema = ({
    availableConstraints,
    availableFilterFields
}) => {
    var pagination = Pagination({ maxLimit: 1000 });

    var schema = ExactObject({
        properties: {
            collectionName: IdentifierString(),
            recordType: IdentifierString(), // FIXME: enum
            searchOptions: ExactObject({
                properties: {
                    enableResearchGroupFilter: DefaultBool({ default: true })
                },
                required: []
            }),
            target: StringEnum([ 'table', 'optionlist' ]),
            showHidden: DefaultBool(),
            excludedIds: IdList(),
            
            filters: SearchFilters({
                metadata,
                availableFilterFields
            }),
            constraints: SearchConstraints({ availableConstraints }),
            
            ...pagination.properties,
            sort: Sort(),
        },
        required: [
            'collectionName',
            'filters',
            ...pagination.required,
        ]
    });

    //console.dir(schema, { depth: null })

    return schema;
};

module.exports = FullBodySchema;
