'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:ageFrames'
);

var {
    validateOrThrow,
    ResponseBody,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var {
    AddLastKnownEventIdStage,
    StripEventsStage,
} = require('@mpieva/psydb-mongo-stages');

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

    await verifyStudyAccess({
        db,
        permissions,
        studyIds,
        action: 'read',
    });

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
