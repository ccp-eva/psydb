'use strict';
var {
    OpenObject,
    BasicObject,
    StringEnum
} = require('@mpieva/psydb-schema-fields');

var {
    SearchFilters,
    SearchConstraints,
    Pagination,
    Sort,
} = require('@mpieva/psydb-schema-fields-special');

var metadata = require('@mpieva/psydb-common-lib/src/field-type-metadata');

var Core = (bag = {}) => {
    return BasicObject({
        target: StringEnum([ 'table', 'optionlist' ]),
    })
}

var Full = (bag = {}) => {
    var {
        availableConstraints,
        availableFilterFields
    } = bag;

    var pagination = Pagination({ maxLimit: 1000 });

    return OpenObject({ // FIXME: compat
        properties: {
            target: StringEnum([ 'table', 'optionlist' ]),

            filters: SearchFilters({
                metadata,
                availableFilterFields
            }),
            constraints: SearchConstraints({ availableConstraints }),
            
            ...pagination.properties,
            sort: Sort(),
        },
        required: [ 'filters', ...pagination.required ],
    })
}

module.exports = {
    Core,
    Full
}
