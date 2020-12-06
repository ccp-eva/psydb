'use strict';
var wrapInArray = require('./wrap-in-array'),
    createBaseStages = require('./create-base-stages'),
    createRecordRestrictionStages = require('./create-record-restriction-stages');

var searchWithFullRestrictions = async ({
    db,
    collectionName,

    allowedResearchGroupIds,
    // is ['state.foo', ...] 
    // or ['gdpr.state.foo', 'scientific.state.foo', ...]
    searchableFields,
    readableFields,

    query,
    projection,
    sort,
    skip,
    limit,
}) => {

    var wrappedStages = [
        ...createRecordRestrictionStages({
            allowedResearchGroupIds,
        }),
        
        { $project: {
            type: true,
            subtype: true,
            state: true,
            'scientific.state': true,
            'gdpr.state': true,
        }},

        { $addFields: {
            // IMPORTANT: all stuff including __READ_CLONE needs
            // to be rejected
            __READ_CLONE: '$$ROOT',
        }},

        { $project: {
            __READ_CLONE: true,
            ...searchableFields.reduce((acc, field) => ({
                [field]: true,
            }), {})
        }},

        ...createBaseStages({
            query,
            projection,
            sort,
            skip,
            limit
        }),

        { $project: {
            '__READ_CLONE._id': true,
            '__READ_CLONE.type': true,
            '__READ_CLONE.subtype': true,
            ...readableFields.reduce((acc, field) => ({
                ...acc,
                [`__READ_CLONE.${field}`]: true,
            }), {}),
        }},
        
        { $replaceRoot: { newRoot: '$__READ_CLONE' }},
    ];

    var records = await (
        db.collection(collectionName)
        .aggregate(wrappedStages)
        .toArray()
    );

    return records;
}

module.exports = searchWithFullRestrictions;
