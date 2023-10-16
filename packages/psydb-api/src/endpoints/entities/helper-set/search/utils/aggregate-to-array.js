'use strict';
var { entries } = require('@mpieva/psydb-core-utils');

var aggregateToArray = (bag = {}) => {
    var { db, mongoSettings, ...rest } = bag;
    var [ collection, stages ] = entries(rest)[0];

    return (
        db.collection(collection).aggregate(
            stages, mongoSettings
        ).toArray()
    )
}

module.exports = aggregateToArray;
