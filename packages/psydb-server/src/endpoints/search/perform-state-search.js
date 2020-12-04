'use strict';

var wrapInArray = ({ when, then }) => (
    when ? [then] : []
);

var performStateSearch = async ({
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
    var redactPermissions = [
        'foo-group',
        // SLOW
        /*{
            researchGroupId: 'foo-group',
            permission: 'read'
        },
        {
            researchGroupId: 'foo-group',
            permission: 'write'
        }*/
    ];

    // SLOW
    /*var statePermissionPath = (
        'systemPermissions.accessRightsByResearchGroup'
    );*/

    // STILL SLOW
    var statePermissionPath = (
        'systemPermissions.accessRightsByResearchGroup.researchGroupId'
    );

    var hasAccess = (prefix) => (
        { $gt: [
            { $size: {
                $ifNull: [
                    { $setIntersection: [
                        `$${prefix}.${statePermissionPath}`,
                        redactPermissions
                    ]},
                    []
                ]
            }},
            0
        ]}
    );

    // DOESNT WOORK
    /*var hasAccess = (prefix) => (
        { 
            [`${prefix}.${statePermissionPath}`]: { 
                $in: redactPermissions
            }
        }
    );*/

    var wrappedStages = [
        { $project: {
            type: true,
            subtype: true,
            state: { $cond: {
                if: hasAccess('state'),
                then: '$state',
                else: '$$REMOVE'
            }},
            'scientific': { $cond: {
                if: hasAccess('scientific.state'),
                then: '$scientific',
                else: '$$REMOVE'
            }},
            'gdpr': { $cond: {
                if: hasAccess('gdpr.state'),
                then: '$gdpr',
                else: '$$REMOVE'
            }},
        }},
        { $match: {
            $or: [
                { state: { $exists: true }},
                { 'scientific': { $exists: true }},
                { 'gdpr': { $exists: true }},
            ]
        }},
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
            ...searchableFields.reduce((acc, field) => ({
                [field]: true,
            }), {}),

            '__READ_CLONE._id': true,
            '__READ_CLONE.type': true,
            '__READ_CLONE.subtype': true,
            ...readableFields.reduce((acc, field) => ({
                ...acc,
                [`__READ_CLONE.${field}`]: true,
            }), {}),
        }},
        
        ...wrapInArray({
            when: (query && typeof query === 'object'),
            then: { $match: query }
        }),

        ...wrapInArray({
            when: (projection && typeof projection === 'object'),
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

        { $replaceRoot: { newRoot: '$__READ_CLONE' }},
    ];

    var records = await (
        db.collection(collectionName)
        .aggregate(wrappedStages)
        .toArray()
    );

    return records;
}

module.exports = performStateSearch;
