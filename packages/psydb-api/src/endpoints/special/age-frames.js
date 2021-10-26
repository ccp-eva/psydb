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
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        studyId: ForeignId({ collection: 'study' }),
    },
    required: [
        'studyId',
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

    var { studyId } = request.body;

    var records = await (
        db.collection('ageFrame').aggregate([
            { $match: { studyId }},
    
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
