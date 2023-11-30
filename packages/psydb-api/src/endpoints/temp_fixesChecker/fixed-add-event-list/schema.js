'use strict';
var { ClosedObject } = require('@mpieva/psydb-schema-fields');
var { Pagination } = require('@mpieva/psydb-schema-fields-special');

var Schema = (bag = {}) => {
    var pagination = Pagination({ maxLimit: 1000 });

    return ClosedObject({
        ...pagination.properties,
    })
}

module.exports = Schema;
