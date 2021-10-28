'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:testableSubjectTypesForStudies'
);

var { unique } = require('@mpieva/psydb-common-lib');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');


var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var {
    ExactObject,
    ForeignIdList,
    ExperimentVariantEnum,
} = require('@mpieva/psydb-schema-fields');

var {
    SystemPermissionStages,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var RequestBodySchema = () => ExactObject({
    properties: {
        studyIds: ForeignIdList({ collection: 'study', minItems: 1 }),
        labProcedureType: ExperimentVariantEnum(),
    },
    required: [
        'studyIds',
        'labProcedureType',
    ]
});

var testableSubjectTypesForStudies = async (context, next) => {
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
        throw new ApiError(400, {
            apiStatus: 'InvalidRequestSchema',
            data: { ajvErrors: ajv.errors }
        });
    };

    var {
        studyIds,
        labProcedureType,
    } = request.body;

    // TODO: check body + unmarshal

    var studyRecords = await db.collection('study').aggregate([
        { $match: {
            _id: { $in: studyIds }
        }},
        ...SystemPermissionStages({ permissions }),
        StripEventsStage(),
    ]).toArray()

    var settingRecords = await (
        db.collection('experimentVariantSetting').aggregate([
            { $match: {
                studyId: { $in: studyIds },
                type: labProcedureType
            }},
            { $project: { _id: true, 'state.subjectTypeKey': true }},
        ]).toArray()
    );

    var subjectTypeKeys = unique(settingRecords.map((it) => (
        it.state.subjectTypeKey
    )));

    var subjectRecordTypeRecords = await (
        db.collection('customRecordType').aggregate([
            { $match: {
                collection: 'subject',
                type: { $in: subjectTypeKeys }
            }},
            { $project: {
                collection: true,
                type: true,
                'state.label': true,
            }}
        ]).toArray()
    );
    
    context.body = ResponseBody({
        data: {
            subjectRecordTypeRecords,
        }
    });

    await next();
}

module.exports = testableSubjectTypesForStudies;
