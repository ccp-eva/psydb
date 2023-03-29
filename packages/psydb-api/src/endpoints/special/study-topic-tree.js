'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:studyTopicTree'
);

var { arrayToTree } = require('performant-array-to-tree');

var {
    ResponseBody,
    validateOrThrow,
    verifyStudyAccess,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var {
    AddLastKnownEventIdStage,
    StripEventsStage,
} = require('@mpieva/psydb-mongo-stages');

var {
    ExactObject,
    SaneString,
    Id,
    ForeignIdList,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        activeIds: ForeignIdList({ collection: 'studyTopic' }),
        name: SaneString(),
    },
    required: []
})

var studyTopicTree = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    })

    var { name, activeIds } = request.body;
    var shouldSearch = !!name;

    var records;
    if (shouldSearch) {
        records = await (
            db.collection('studyTopic').aggregate([
                { $match: {
                    'state.internals.isRemoved': { $ne: true },
                    $or: [
                        { 'state.name': new RegExp(name, 'i') },
                        ...(Array.isArray(activeIds) && activeIds.length > 0 ? [
                            { '_id': { $in: activeIds }},
                            { 'state.parentId': { $in: activeIds }}
                        ] : [])
                    ]
                }},
                { $addFields: {
                    _matchesQuery: { $regexMatch: {
                        input: '$state.name',
                        regex: new RegExp(name, 'i'),
                    }}
                }},

                // reverse walk from found leafs to roots upwards
                // so that non-matching parent nodes dont get ommited
                { $graphLookup: {
                    from: 'studyTopic',
                    startWith: '$state.parentId',
                    connectFromField: 'state.parentId',
                    connectToField: '_id',
                    as: 'treeParents',
                    //depthField: 'treeDepth',
                }},

                // merge the base node with the children so that
                // unwind is easy
                { $addFields: {
                    'combinedNodes': { $concatArrays: [
                        [ '$$ROOT' ],
                        '$treeParents'
                    ]}
                }},
                { $unwind: '$combinedNodes' },
                { $replaceRoot: { newRoot: '$combinedNodes' }},
                { $project: { 'treeParents': false }}, // because $$ROOT had it

                // we now have duplicates; we need to remove those
                { $group: {
                    _id: '$_id',
                    node: { $first: '$$ROOT' }
                }},
                { $replaceRoot: { newRoot: '$node' }},
                { $sort: {
                    'state.name': 1,
                    'events.0.timestamp': 1,
                }},

                AddLastKnownEventIdStage(),
                StripEventsStage(),
            ]).toArray()
        );
    }
    else {
        records = await (
            db.collection('studyTopic').aggregate([
                { $match: {
                    'state.internals.isRemoved': { $ne: true },
                }},
                /*{ $addFields: {
                    _matchesQuery: true
                }},*/
                { $sort: {
                    'state.name': 1,
                    'events.0.timestamp': 1,
                }},
                AddLastKnownEventIdStage(),
                StripEventsStage(),
            ]).toArray()
        );
    }


    // NOTE: we have multiple trees because we have multiple roots
    // possibly
    var trees = arrayToTree(records, {
        id: '_id',
        parentId: 'state.parentId'
    });

    context.body = ResponseBody({
        data: {
            //records,
            trees,
            recordsCount: records.length
        },
    });

    await next();
}

module.exports = studyTopicTree;
