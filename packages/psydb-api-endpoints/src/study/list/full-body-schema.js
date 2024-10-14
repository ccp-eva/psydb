'use strict';
var {
    MaxObject, ExactObject, IdentifierString, DefaultBool
} = require('@mpieva/psydb-schema-fields');

var {
    ListBodyCommon, SearchConstraints, Pagination, Sort
} = require('@mpieva/psydb-schema-fields-special');

var futils = require('@mpieva/psydb-custom-fields-common');


var FullBodySchema = (bag) => {
    var {
        availableConstraints,
        availableQuickSearchFields,
    } = bag;

    var common = ListBodyCommon();
    var pagination = Pagination({ maxLimit: 1000 });

    var schema = ExactObject({
        properties: {
            ...common.properties,
            ...pagination.properties,

            recordType: IdentifierString(), // FIXME: enum

            // FIXME: im not sure if thats even required on here
            // as it should only be for sutom record types
            searchOptions: MaxObject({
                enableResearchGroupFilter: DefaultBool({ default: true })
            }),
            
            // FIXME: rename this to quicksearch
            filters: futils.createFullQuickSearchSchema({
                definitions: availableQuickSearchFields,
            }),
            
            // FIXME: search constraints cant handle arrays for some reason
            constraints: SearchConstraints({ availableConstraints }),
            
            sort: Sort(),
        },
        required: [
            'filters',
            ...common.required,
            ...pagination.required,
        ]
    });
    return schema;
}

module.exports = FullBodySchema;
