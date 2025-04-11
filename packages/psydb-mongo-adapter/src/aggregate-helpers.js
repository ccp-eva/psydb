'use strict';
var {
    aggregateOne, aggregateToArray,
    aggregateToCursor
} = require('@cdxoo/mongodb-utils');

var withRetracedErrors = require('./with-retraced-errors');

var aggregateCount = async (bag) => {
    var { db, mongoSettings, ...rest } = bag;
    var [ collection, query ] = Object.entries(rest)[0];
    
    var stages = (
        !Array.isArray(query) && typeof query === 'object'
        ? [{ $match: query }]
        : [ ...query ]
    );
    stages.push({ $count: '__COUNT__' });

    var result = await withRetracedErrors(
        aggregateOne({ db, mongoSettings, [collection]: stages })
    );

    return (
        result
        ? result.__COUNT__
        : undefined
    );
}

var aggregateToIds = (...args) => (
    withRetracedErrors(
        aggregateToCursor(...args).map(it => it._id).toArray()
    );
)

module.exports = {
    aggregateOne: (...args) => (
        withRetracedErrors(aggregateOne(...args))
    ),
    aggregateToArray: (...args) => (
        withRetracedErrors(aggregateToArray(...args))
    ),
    aggregateToCursor,
    ////////
    aggregateToIds,
    aggregateCount,
}
