'use strict';
var debug = require('debug')('psydb:api:endpoints:experiment:list');
var mingo = require('mingo'); require('mingo/init/system');

var { unique } = require('@mpieva/psydb-core-utils');
var { __fixRelated } = require('@mpieva/psydb-common-compat');
var { SmartArray } = require('@mpieva/psydb-common-lib');

var {
    aggregateToArray,
    aggregateCount
} = require('@mpieva/psydb-mongo-adapter');

var {
    ApiError,
    ResponseBody,
    validateOrThrow,
    
    mappifyPointer,
    fetchRecordLabelsManual,
} = require('@mpieva/psydb-api-lib');

var BodySchema = require('./body-schema');

var listEndpoint = async (context, next) => {
    var { db, request, permissions } = context;

    if (!permissions.hasFlag('canReadParticipation')) {
        throw new ApiError(403);
    }

    // TODO: check headers with ajv
    var { language = 'en', locale, timezone } = request.headers;
    var i18n = { language, locale, timezone };

    validateOrThrow({
        schema: BodySchema(),
        payload: request.body,
        //unmarshalClientTimezone: timezone,
    });

    var {
        //constraints, // TODO
        //filters, // TODO
        offset, limit,
        sort,
    } = request.body;


    var { availableStudyTypes, availableSubjectTypes } = permissions;

    var stages = SmartArray([
        { $match: {
            'state.subjectData.subjectType': { $in: (
                availableSubjectTypes.map(it => it.key)
            )},
            'state.studyRecordType': { $in: (
                availableStudyTypes.map(it => it.key)
            ) },

            'state.isPostprocessed': true,
            //'state.isCanceled': { $ne: true },
        }},
    ]);

    var recordsCount = await aggregateCount({ db, experiment: stages });

    var records = await aggregateToArray({ db, experiment: SmartArray([
        ...stages,
        
        ( offset && { $skip: offset}),
        ( limit && { $limit: limit }),
        ( sort && { $sort: sort }),
    ])});

    var fromItems = mappifyPointer(records, { spreadArrays: true });
    var relatedRecordLabels = await fetchRecordLabelsManual(db, {
        subject: fromItems('/state/selectedSubjectIds'),
        subjectGroup: fromItems('/state/subjectGroupId'),
        location: fromItems('/state/locationId'),
        study: fromItems('/state/studyId'),
        personnel: fromItems('/state/experimentOperatorIds'),
    }, i18n);

    var x = [];
    for (var i = 0; i < 1000; i += 1) {
        x.push(...records);
    }
    debug('mingo start')
    for (var i = 0; i < 10; i += 1) {
        var a = mingo.aggregate(x, [
            { $project: {
                'key': '$state.subjectData.subjectType'
            }},
            { $unwind: '$key' },
        ]).map(it => it.key);

        a = unique(a);
    }
    debug('mingo end')
    console.log(a);
    throw new Error();

    var crtypes = [
        ...fromItems('/state/locationRecordType'),
        ...fromItems('/state/studyRecordType'),
        ...fromItems('/state/subjectData/subjectType')
    ]
    console.log(crtypes);

    // TODO: related crts
    //var relatedCustomRecordTypes = await fetchCRTLabelsManual(db, [
    //], i18n);

    context.body = ResponseBody({
        data: {
            records,
            recordsCount,
            related: __fixRelated({
                relatedRecordLabels
            }, { isResponse: false }),
        },
    });

    debug('next()');
    await next();
}

module.exports = listEndpoint;
