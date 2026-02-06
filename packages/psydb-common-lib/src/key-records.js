'use strict';
var { keyBy } = require('@mpieva/psydb-core-utils');

var keyRecords = (records) => {
    var keyed = keyBy({ items: records, byProp: '_id' });
    return keyed;
}

module.exports = keyRecords;
