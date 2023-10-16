'use strict';
var psydbSchemaFields = require('@mpieva/psydb-schema-fields');

var {
    BasicObject,
    ExactObject,
    OpenObject,
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

    var schema = OpenObject({ // FIXME: compat
        properties: {
            target: StringEnum([ 'table', 'optionlist' ]),
            showHidden: DefaultBool(),
            excludedIds: IdList(),
            extraIds: IdList(), // TODO
            
            filters: SearchFilters({
                metadata,
                availableFilterFields
            }),
            // FIXME: search constraints cant handle arrays for some reason
            constraints: SearchConstraints({ availableConstraints }),
            
            ...pagination.properties,
        },
        required: [
            'filters',
            ...pagination.required,
        ]
    });

    return schema;
};

module.exports = FullBodySchema;
