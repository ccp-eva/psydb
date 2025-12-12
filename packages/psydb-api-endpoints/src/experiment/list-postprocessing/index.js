'use strict';
var debug = require('../debug-helper')('listPostprocessing');
var datefns = require('date-fns');

var { keyBy } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { SystemPermissionStages } = require('@mpieva/psydb-mongo-stages');
var { __fixRelated } = require('@mpieva/psydb-common-compat');

var {
    ApiError,
    ResponseBody,

    validateOrThrow,
    fetchCRTSettings,
    verifyLabOperationAccess,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var BodySchema = require('./body-schema');

var experimentPostprocessing = async (context, next) => {
    var { db, request, permissions } = context;
    var now = new Date();
    
    // TODO: check headers with ajv
    var { language = 'en', locale, timezone } = request.headers;
    var i18n = { language, locale, timezone };

    validateOrThrow({
        schema: BodySchema(),
        payload: request.body
    })

    var { labMethod, subjectType, researchGroupId } = request.body;

    verifyLabOperationAccess({
        researchGroupId,
        labOperationType: labMethod,
        flag: 'canPostprocessExperiments',
        permissions,
    });

    var subjectCRT = await fetchCRTSettings({
        db, collectionName: 'subject', recordType: subjectType
    });

    var studyRecords = await aggregateToArray({ db, study: [
        ...SystemPermissionStages({ collection: 'study', permissions }),

        { $match: {
            'state.researchGroupIds': researchGroupId
        }},
        { $project: {
            '_id': true,
            'state.enableFollowUpExperiments': true,
        }}
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
        experimentRecords = experimentRecords.filter(it => {
            var { start } = it.state.interval;
            
            var noonifiedStart = datefns.add(
                datefns.startOfDay(start),
                { hours: 12 }
            );

            return ( noonifiedStart < now )
        })
    }

    var studyConsentDocs = [];
    if (labMethod === 'inhouse') {
        studyConsentDocs = await aggregateToArray({ db, studyConsentDoc: [
            { $match: {
                'experimentId': { $in: experimentRecords.map(it => it._id) }
            }},
            { $project: {
                '_id': true, 'experimentId': true, 'subjectId': true
            }}
        ]});
    }

    var experimentRelated = await fetchRelatedLabelsForMany({
        db, collectionName: 'experiment', records: experimentRecords, ...i18n
    });

    var studiesById = keyBy({ items: studyRecords, byProp: '_id' });
    var augmented = experimentRecords.map(it => ({
        ...it,
        _enableFollowUpExperiments: (
            studiesById[it.state.studyId].state.enableFollowUpExperiments
        )
    }));

    context.body = ResponseBody({ data: {
        subjectCRT,
        records: augmented,
        related: __fixRelated(experimentRelated, { isResponse: false })
    }});

    await next();
}

module.exports = experimentPostprocessing;
