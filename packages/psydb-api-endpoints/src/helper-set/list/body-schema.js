'use strict';
var {
    MaxObject, OpenObject, IdList, DefaultBool, StringEnum,
} = require('@mpieva/psydb-schema-fields');

var {
    //SearchFilters,
    Pagination, Sort,
} = require('@mpieva/psydb-schema-fields-special');

var futils = require('@mpieva/psydb-custom-fields-common');

//var {
//    ListBodyCommon, Pagination, Sort
//} = require('@mpieva/psydb-api-endpoint-lib/schemas')

//var metadata = require('@mpieva/psydb-common-lib/src/field-type-metadata');

var SearchConstraints = () => {
    var schema = MaxObject({
        '/_id': IdList(),
    });
    return schema;
}

var ListBodyCommon = () => {
    var schema = MaxObject({
        target: StringEnum([ 'table', 'optionlist' ]),
        showHidden: DefaultBool(),
        excludedIds: IdList(),
    });

    return schema;
}

var BodySchema = (bag) => {
    var { availableQuickSearchFields } = bag;

    var common = ListBodyCommon();
    var pagination = Pagination({ maxLimit: 1000 });

    var schema = OpenObject({ // FIXME: compat
        properties: {
            ...common.properties,
            ...pagination.properties,
            
            extraIds: IdList(), // TODO

            // FIXME: rename this to quicksearch
            filters: futils.createFullQuickSearchSchema({
                definitions: availableQuickSearchFields,
            }),
           
            //filters: SearchFilters({
            //    metadata,
            //    availableFilterFields: availableQuickSearchFields,
            //}),
            // FIXME: search constraints cant handle arrays for some reason
            constraints: SearchConstraints(),
        },
        required: [
            'filters',
            ...common.required,
            ...pagination.required,
        ]
    });

    return schema;
};

module.exports = BodySchema;
