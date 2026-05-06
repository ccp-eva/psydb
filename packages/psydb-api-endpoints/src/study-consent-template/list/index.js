'use strict';
var debug = require('../debug-helper')('list');

var { aggregateToArray, aggregateCount }
    = require('@mpieva/psydb-mongo-adapter');
var { MatchConstraintsStage } = require('@mpieva/psydb-mongo-stages');

var { SmartArray } = require('@mpieva/psydb-common-lib');
var { ResponseBody, validateOrThrow } = require('@mpieva/psydb-api-lib');

var futils = require('@mpieva/psydb-custom-fields-mongo');
var definitions = require('./definitions');
var BodySchema = require('./body-schema');


var listEndpoint = async (context, next) => {
    var { db, request, permissions } = context;

    // TODO: check headers with ajv
    var { language = 'en', locale, timezone } = request.headers;
    var i18n = { language, locale, timezone };

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
            'studyType': true,
            'subjectType': true,
            'state.templateName': true,
            'state.title': true,
            'state.isEnabled': true,
        }},

        ( sort?.path && { $sort: {
            [sort.path]: sort.direction === 'desc' ? -1 : 1
        }}),

        (offset && { $skip: offset }),
        (limit && { $limit: limit }),
    ])

    debug('start count');
    var recordsCount = await aggregateCount({ db, studyConsentTemplate: [
        ...precount
    ]});
    debug('done count');
    
    debug('start aggregate');
    var records = await aggregateToArray({ db, studyConsentTemplate: [
        ...precount, ...postcount
    ]});
    debug('done aggregate');

    context.body = ResponseBody({
        data: {
            records, recordsCount,
            displayFieldData: definitions.displayFields,
        },
    });

    debug('next()');
    await next();
}

module.exports = listEndpoint;
