'use strict';
var { MaxObject, ExactObject, IdentifierString, DefaultBool }
    = require('@mpieva/psydb-schema-fields');
var { ListBodyCommon, Pagination, Sort }
    = require('@mpieva/psydb-schema-fields-special');

var futils = require('@mpieva/psydb-custom-fields-common');
var definitions = require('./definitions');

var BodySchema = (bag) => {
    var common = ListBodyCommon();
    var pagination = Pagination({ maxLimit: 1000 });

    var schema = ExactObject({
        properties: {
            ...common.properties,
            ...pagination.properties,

            'quicksearch': QuickSearch(),
            'constraints': SearchConstraints(),
            
            'sort': Sort(),
        },
        required: [
            ...common.required,
            ...pagination.required,
        ]
    });
    return schema;
}

var QuickSearch = () => {
    var schema = futils.createFullQuickSearchSchema({
        definitions: definitions.displayFields
    });

    return schema;
}

var SearchConstraints = () => {
    var schema = futils.createFullSearchConstraintsSchema({
        definitions: definitions.constraints,
    });

    return schema;
}

module.exports = BodySchema;
