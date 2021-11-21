'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:ageFrames'
);

var {
    validateOrThrow,
    ResponseBody
} = require('@mpieva/psydb-api-lib');

var {
    AddLastKnownEventIdStage,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var fetchRelatedLabelsForMany = require('@mpieva/psydb-api-lib/src/fetch-related-labels-for-many');

var {
    ExactObject,
    ForeignIdList,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        studyIds: ForeignIdList({ collection: 'study' }),
    },
    required: [
        'studyIds',
    ]
})

var ageFrames = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    })

    var { studyIds } = request.body;

    // TODO: permissions

    var records = await (
        db.collection('ageFrame').aggregate([
            { $match: {
                studyId: { $in: studyIds }
            }},
    
            AddLastKnownEventIdStage(),
            StripEventsStage(),
        ]).toArray()
    )

    var ageFrameRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'ageFrame',
        records,
    })

    context.body = ResponseBody({
        data: {
            records,
            ...ageFrameRelated
        },
    });

    await next();
}

module.exports = ageFrames;
