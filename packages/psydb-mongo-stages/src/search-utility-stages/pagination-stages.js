'use strict';
var { SmartArray } = require('@mpieva/psydb-common-lib');

var PaginationStages = (bag = {}) => {
    var { offset = 0, limit = 0 } = bag;

    return SmartArray([
        offset && { $skip: offset },
        limit && { $limit: limit }
    ])
}

module.exports = PaginationStages;
