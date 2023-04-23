'use strict';
var { ClosedObject } = require('@mpieva/psydb-schema-fields');

var Pagination = (bag = {}) => {
    var { maxLimit = 1000 } = bag;

    return ClosedObject({
        offset: { // FIXME: use psydb field
            type: 'integer',
            minimum: 0,
        },
        limit: { // FIXME: use psydb field
            type: 'integer',
            minimum: 1,
            maximum: maxLimit,
        },
    })
}

module.exports = { Pagination };
