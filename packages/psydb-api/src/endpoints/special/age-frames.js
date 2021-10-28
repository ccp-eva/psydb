'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:ageFrames'
);

var Ajv = require('@mpieva/psydb-api-lib/src/ajv'),
    ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

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

    var ajv = Ajv(),
        isValid = false;

    isValid = ajv.validate(
        RequestBodySchema(),
        request.body
    );
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, 'InvalidRequestSchema', {
            ajvErrors: ajv.errors
        });
    };

    var { studyIds } = request.body;

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
