'use strict';
var debug = require('../debug-helper')('listPostprocessing');

var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { SystemPermissionStages } = require('@mpieva/psydb-mongo-stages');
var { __fixRelated } = require('@mpieva/psydb-common-compat');

var {
    ApiError, ResponseBody,
    validateOrThrow, fetchCRTSettings, verifyLabOperationAccess,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var BodySchema = require('./body-schema');
var {
    augmentEnableFollowUpExperiments,
    augmentStudyConsentDocInfo,
    filterBeforeNoon,
} = require('./utils');


var experimentPostprocessing = async (context, next) => {
    var { db, request, permissions, i18n } = context;
    var now = new Date(); // XXX: why now not in context??
    
    // TODO: check headers with ajv
    //var { language = 'en', locale, timezone } = request.headers;
    //var i18n = { language, locale, timezone };

    validateOrThrow({
        schema: BodySchema(),
        payload: request.body
    })

    var { labMethod, subjectType, researchGroupId } = request.body;

    verifyLabOperationAccess({
        permissions, researchGroupId,
        labOperationType: labMethod, flag: 'canPostprocessExperiments',
    });

    var subjectCRT = await fetchCRTSettings({
        db, collectionName: 'subject', recordType: subjectType
    });

    var studyRecords = await aggregateToArray({ db, study: [
        ...SystemPermissionStages({ collection: 'study', permissions }),

        { $match: { 'state.researchGroupIds': researchGroupId }},
        { $project: { '_id': true, 'state.enableFollowUpExperiments': true }}
    ]});
    
    var studyIds = studyRecords.map(it => it._id);
    var experimentRecords = await aggregateToArray({ db, experiment: [
        { $match: {
            'type': labMethod,
            'state.studyId': { $in: studyIds },
            'state.interval.start': { $lte: now },
            'state.isCanceled': false,
            'state.subjectData': { $elemMatch: {
                subjectType, participationStatus: 'unknown',
            }}
        }},
        { $sort: { 'state.interval.start': 1 }}
    ]});

    if (labMethod === 'away-team') {
        experimentRecords = filterBeforeNoon({ experimentRecords, now });
    }
    if (labMethod === 'inhouse') {
        await augmentStudyConsentDocInfo({ db, experimentRecords });
    }
    
    augmentEnableFollowUpExperiments({
        experimentRecords, studyRecords
    });

    var experimentRelated = await fetchRelatedLabelsForMany({
        db, collectionName: 'experiment', records: experimentRecords, i18n
    });

    context.body = ResponseBody({ data: {
        subjectCRT,
        records: experimentRecords,
        related: __fixRelated(experimentRelated, { isResponse: false })
    }});

    await next();
}

module.exports = experimentPostprocessing;
