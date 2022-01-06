'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:searchStudiesForExclusion'
);

var {
    ResponseBody,
    validateOrThrow,
    fromFacets,
} = require('@mpieva/psydb-api-lib');

var {
    AddLastKnownEventIdStage,
    StripEventsStage,
} = require('@mpieva/psydb-mongo-stages');

var {
    ExactObject,
    SaneString,
    Integer,
    ForeignIdList,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        studyIds: ForeignIdList({ collection: 'study' }),
        excludedStudyIds: ForeignIdList({ collection: 'study' }),
        selectedTopicIds: ForeignIdList({ collection: 'studyTopic' }),
        nameOrShorthand: SaneString(),
        offset: Integer({ minimum: 0 }),
        limit: Integer({ maximum: 100 }),
    },
    required: []
});

var searchStudiesForExclusion = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    });

    var {
        studyIds,
        excludedStudyIds = [],
        selectedTopicIds = [],
        nameOrShorthand,
        limit = 0,
        offset = 0,
    } = request.body;

    var shouldSearch = (!!nameOrShorthand);
    var shouldFilterTopics = (!shouldSearch && selectedTopicIds.length > 0);

    var facets = await (
        db.collection('study').aggregate(clean([
            studyIds && { $match: {
                '_id': { $in: studyIds }
            }},
            shouldSearch && { $match: {
                $or: clean([
                    { 'state.name': new RegExp(nameOrShorthand, 'i') },
                    { 'state.shorthand': new RegExp(nameOrShorthand, 'i') }
                ])
            }},
            shouldFilterTopics && { $match: {
                'state.studyTopicIds': { $in: selectedTopicIds }
            }},
            excludedStudyIds.length > 0 && { $match: {
                '_id': { $nin: excludedStudyIds }
            }},

            { $project: {
                'state.name': true,
                'state.shorthand': true,
            }},
            { $sort: {
                'state.name': 1,
                'state.shorthand': 1,
            }},

            { $facet: {
                records: [
                    { $skip: offset },
                    ...(limit ? [{ $limit: limit }] : [])
                ],
                recordsCount: [{ $count: 'COUNT' }]
            }}
        ])).toArray()
    );
    
    var [ records, recordsCount ] = fromFacets(facets);
    
    context.body = ResponseBody({
        data: {
            records,
            recordsCount,
        },
    });
    
    await next();   
}

var clean = (ary) => ary.filter(it => !!it)

module.exports = searchStudiesForExclusion;
