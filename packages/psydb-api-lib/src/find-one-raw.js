'use strict';
var { entries } = require('@mpieva/psydb-core-utils');

var findOne_RAW = (bag = {}) => {
    var { db, mongoSettings, ...rest } = bag;
    var [ collection, filter ] = entries(rest)[0];

    return (
        db.collection(collection).findOne(
            filter, mongoSettings
        )
    )
}

module.exports = findOne_RAW;
