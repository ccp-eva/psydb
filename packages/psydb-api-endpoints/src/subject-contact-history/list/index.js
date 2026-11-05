'use strict';
var debug = require('../debug-helper')('list');

var { aggregateToArray, aggregateCount }
    = require('@mpieva/psydb-mongo-adapter');
var { ApiError, ResponseBody, validateOrThrow, fetchRecordLabelsManual }
    = require('@mpieva/psydb-api-lib');

var BodySchema = require('./body-schema');

var listEndpoint = async (context, next) => {
    var { db, request, permissions, i18n } = context;
    
    debug('start validating');
    validateOrThrow({
        schema: BodySchema(),
        payload: request.body,
    });
    debug('done validating');
    
    var { subjectId } = request.body;

    if (!permissions.hasFlag('canReadSubjects')) {
        throw new ApiError(403)
    }
    
    var stages = [
        { $match: { subjectId }},
        { $sort: { 'contactedAt': -1 }},
    ]

    debug('start count');
    var recordsCount = await aggregateCount({ db, subjectContactHistory: [
        ...stages
    ]});
    debug('done count');
    
    debug('start aggregate');
    var records = await aggregateToArray({ db, subjectContactHistory: [
        ...stages
    ]});
    debug('done aggregate');

    var related = {
        records: await fetchRecordLabelsManual(db, {
            personnel: records.map(it => it.contactedBy),
        }, { oldWrappedLabels: false, ...i18n })
    };

    context.body = ResponseBody({
        data: { records, recordsCount, related },
    });

    debug('next()');
    await next();
}

module.exports = listEndpoint;
