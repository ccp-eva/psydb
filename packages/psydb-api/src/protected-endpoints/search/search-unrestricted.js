'use strict';
var wrapInArray = require('./wrap-in-array'),
    createBaseStages = require('./create-base-stages');

var searchWithFullRestrictions = async ({
    collection,

    allowedResearchGroupIds,

    query,
    projection,
    sort,
    skip,
    limit,
}) => {

    var stages = [
        
        { $project: {
            state: true,
            'scientific.state': true,
            'gdpr.state': true,
        }},

        ...createBaseStages({
            query,
            projection,
            sort,
            skip,
            limit
        }),
    ];

    var records = await (
        collection
        .aggregate(stages)
        .toArray()
    );

    return records;
}

module.exports = searchWithFullRestrictions;
