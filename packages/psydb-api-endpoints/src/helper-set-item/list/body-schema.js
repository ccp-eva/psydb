'use strict';
var {
    MaxObject, OpenObject, Id, IdList
} = require('@mpieva/psydb-schema-fields');

var {
    ListBodyCommon, Pagination, Sort
} = require('@mpieva/psydb-schema-fields-special');

var futils = require('@mpieva/psydb-custom-fields-common');

var SearchConstraints = () => {
    var schema = MaxObject({
        '/_id': IdList(),
        '/setId': Id(),
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
