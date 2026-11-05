'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:testableSubjectTypesForStudies'
);

var {
    unique
} = require('@mpieva/psydb-core-utils');

var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');

var {
    validateOrThrow,
    ApiError,
    ResponseBody,
} = require('@mpieva/psydb-api-lib');

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
    var { db, permissions, request } = context;

    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    });

    var { studyIds, labProcedureType } = request.body;
    var { isRoot, availableStudyTypes, availableSubjectTypes } = permissions;

    // TODO: permissions

    var studyRecords = await aggregateToArray({ db, study: [
        { $match: {
            '_id': { $in: studyIds },
            // XXX: this needs to be moved to SystemPermissionStages?
            ...(!isRoot() && {
                'type': { $in: availableStudyTypes.map(it => it.key) }
            })
        }},
        ...SystemPermissionStages({
            collection: 'study',
            permissions
        }),
        StripEventsStage(),
    ]});

    var settingRecords = await aggregateToArray({
        db, experimentVariantSetting: [
            { $match: {
                'studyId': { $in: studyIds },
                'type': labProcedureType,

                ...(!isRoot() && {
                    'state.subjectTypeKey': {
                        $in: availableSubjectTypes.map(it => it.key)
                    }
                })
            }},
            { $project: { _id: true, 'state.subjectTypeKey': true }},
        ]
    });

    var subjectTypeKeys = unique(settingRecords.map((it) => (
        it.state.subjectTypeKey
    )));

    var subjectCRTRecords = await aggregateToArray({ db, customRecordType: [
        { $match: {
            collection: 'subject',
            type: { $in: subjectTypeKeys }
        }},
        { $project: {
            collection: true,
            type: true,
            'state.label': true,
        }}
    ]});
    
    context.body = ResponseBody({
        data: {
            subjectRecordTypeRecords: subjectCRTRecords
        }
    });

    await next();
}

module.exports = testableSubjectTypesForStudies;
