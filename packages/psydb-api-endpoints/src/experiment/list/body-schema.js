'use strict';
var {
    MaxObject, ExactObject,
} = require('@mpieva/psydb-schema-fields');

var {
    Pagination, Sort
} = require('@mpieva/psydb-schema-fields-special');

var BodySchema = (bag) => {
    var pagination = Pagination({ maxLimit: 1000 });

    var schema = ExactObject({
        properties: {
            ...pagination.properties,
            'sort': Sort(),
        },
        required: [
            ...pagination.required,
        ]
    });

    return schema;
}

module.exports = BodySchema;
