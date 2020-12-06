'use strict';
var wrapInArray = require('./wrap-in-array');

var createBaseStages = ({
    query,
    projection,
    sort,
    skip,
    limit
}) => ([

    ...wrapInArray({
        when: query,
        then: { $match: query }
    }),

    ...wrapInArray({
        when: projection,
        then: { $project: projection }
    }),

    ...wrapInArray({
        when: (sort && Object.keys(sort).length > 0),
        then: { $sort: sort }
    }),

    ...wrapInArray({
        when: (skip > 0),
        then: { $skip: skip }
    }),

    ...wrapInArray({
        when: (limit > 0),
        then: { $limit: limit }
    }),

]);

module.exports = createBaseStages;
