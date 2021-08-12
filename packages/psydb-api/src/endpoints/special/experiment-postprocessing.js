'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:experimentPostprocessing'
);

var Ajv = require('@mpieva/psydb-api-lib/src/ajv'),
    ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var groupBy = require('@mpieva/psydb-common-lib/src/group-by');
var keyBy = require('@mpieva/psydb-common-lib/src/key-by');
var compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');
var fetchRelatedLabelsForMany = require('@mpieva/psydb-api-lib/src/fetch-related-labels-for-many');

var {
    StripEventsStage,
    SystemPermissionStages,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

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

    var ajv = Ajv(),
        isValid = false;

    isValid = ajv.validate(
        RequestBodySchema(),
        request.body
    );
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, 'InvalidRequestSchema');
    };

    var {
        experimentType,
        researchGroupId,
        subjectRecordType,
    } = request.body;

    if (!permissions.hasRootAccess) {
        var allowed = permissions.allowedResearchGroupIds.find(id => {
            return compareIds(id, researchGroupId)
        })
        if (!allowed) {
            throw new ApiError(403)
        }
    }

    var studyRecords = await (
        db.collection('study').aggregate([
            ...SystemPermissionStages({ permissions }),
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
                'state.interval.end': { $lte: new Date() },
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
