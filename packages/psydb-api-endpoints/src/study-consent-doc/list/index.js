'use strict';
var debug = require('../debug-helper')('list');

var { aggregateToArray, aggregateCount }
    = require('@mpieva/psydb-mongo-adapter');
var { MatchConstraintsStage } = require('@mpieva/psydb-mongo-stages');

var { SmartArray } = require('@mpieva/psydb-common-lib');
var { fetchRecordLabelsManual } = require('@mpieva/psydb-db-utils');
var { ApiError, ResponseBody, validateOrThrow, fetchCRTLabelsManual }
    = require('@mpieva/psydb-api-lib');

var futils = require('@mpieva/psydb-custom-fields-mongo');
var definitions = require('./definitions');
var BodySchema = require('./body-schema');


var listEndpoint = async (context, next) => {
    var { db, request, permissions, i18n } = context;

    if (!permissions.hasCollectionFlag('studyConsentDoc', 'read')) {
        throw new ApiError(403);
    }

    debug('start validating');

    validateOrThrow({
        schema: BodySchema(),
        payload: request.body,
    });
    
    debug('done validating');

    var { target = 'table' } = request.body;

    var {
        quicksearch = {}, constraints = {},
        showHidden, offset, limit, sort,
    } = request.body;


    var precount = SmartArray([
        ...futils.createFullQuicksearchStages({
            quicksearch, definitions: definitions.displayFields
        }),

        MatchConstraintsStage({ constraints, __sanitize_$in: true }),
    ]);

    var postcount = SmartArray([
        { $project: {
            'studyId': true,
            'subjectId': true,
            'subjectType': true,
            'state.studyConsentFormSnapshot.state.internalName': true,
            'state.studyConsentFormSnapshot.state.title': true,
        }},

        ( sort?.path && { $sort: {
            [sort.path]: sort.direction === 'desc' ? -1 : 1
        }}),

        (offset && { $skip: offset }),
        (limit && { $limit: limit }),
    ])

    debug('start count');
    var recordsCount = await aggregateCount({ db, studyConsentDoc: [
        ...precount
    ]});
    debug('done count');
    
    debug('start aggregate');
    var records = await aggregateToArray({ db, studyConsentDoc: [
        ...precount, ...postcount
    ]});
    debug('done aggregate');

    var related = {
        records: await fetchRecordLabelsManual(db, {
            'subject': records.map(it => it.subjectId),
            'study': records.map(it => it.studyId),
        }, { oldWrappedLabels: true, ...i18n }),
        crts: await fetchCRTLabelsManual({
            db, i18n, records, pointers: { 'subject': [ '/subjectType' ]}
        }),
    };

    context.body = ResponseBody({
        data: {
            records, recordsCount, related,
            displayFieldData: definitions.displayFields,
        },
    });

    debug('next()');
    await next();
}

module.exports = listEndpoint;
