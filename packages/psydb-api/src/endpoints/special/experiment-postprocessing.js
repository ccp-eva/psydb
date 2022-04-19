'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:experimentPostprocessing'
);

var {
    groupBy,
    keyBy,
    compareIds
} = require('@mpieva/psydb-core-utils');

var {
    ApiError,
    ResponseBody,

    validateOrThrow,
    verifyLabOperationAccess,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var {
    StripEventsStage,
    SystemPermissionStages,
} = require('@mpieva/psydb-mongo-stages');

var {
    ExactObject,
    ForeignId,
    CustomRecordTypeKey,
    DateTimeInterval,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        experimentType: { type: 'string', enum: [ 'inhouse', 'away-team' ] },
        subjectRecordType: CustomRecordTypeKey({ collection: 'subject' }),
        researchGroupId: ForeignId({
            collection: 'researchGroup',
        }),
    },
    required: [
        'experimentType',
        'subjectRecordType',
        'researchGroupId',
    ]
})

var experimentPostprocessing = async (context, next) => {

    var { 
        db,
        permissions,
        request,
    } = context;

    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    })

    var {
        experimentType,
        researchGroupId,
        subjectRecordType,
    } = request.body;

    verifyLabOperationAccess({
        researchGroupId,
        labOperationType: experimentType,
        flag: 'canPostprocessExperiments',
        permissions,
    })

    var studyRecords = await (
        db.collection('study').aggregate([
            ...SystemPermissionStages({
                collection: 'study',
                permissions
            }),
            { $match: {
                'state.researchGroupIds': researchGroupId
            }},
            { $project: {
                _id: true
            }}
        ]).toArray()
    )

    var studyIds = studyRecords.map(it => it._id);
    var experimentRecords = await (
        db.collection('experiment').aggregate([
            { $match: {
                'type': experimentType,
                'state.studyId': { $in: studyIds },
                'state.interval.start': { $lte: new Date() },
                'state.isCanceled': false,
                'state.subjectData': { $elemMatch: {
                    participationStatus: 'unknown',
                    subjectType: subjectRecordType,
                }}
            }},
            StripEventsStage(),
            { $sort: { 'state.interval.start': 1 }}
        ]).toArray()
    );

    var experimentRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'experiment',
        records: experimentRecords
    })

    context.body = ResponseBody({
        data: {
            records: experimentRecords,
            ...experimentRelated,
        },
    });

    await next();
}

module.exports = experimentPostprocessing;
