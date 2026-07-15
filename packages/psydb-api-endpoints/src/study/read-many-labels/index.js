'use strict';
var { unique } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { match, SystemPermissionStages }
    = require('@mpieva/psydb-mongo-stages');
var { ApiError, ResponseBody, validateOrThrow, fetchCRTSettings }
    = require('@mpieva/psydb-api-lib');

var BodySchema = require('./body-schema');

var readManyLabels = async (context, next) => {
    var { db, request, permissions, i18n } = context;
    
    validateOrThrow({ schema: BodySchema(), payload: request.body, i18n });
    var { ids } = request.body;
   
    var stages = [
        { $match: { '_id': { $in: ids }}},
        match.isNotRemoved(),
    ];

    var stubs = await aggregateToArray({ db, study: [
        ...stages
    ]});
    
    if (stubs.length < 1) {
        throw new ApiError(404, 'NoAccessibleRecordFound');
    }
    if (unique(stubs.map(it => it.type)).length > 1) {
        throw new ApiError(409, 'MixedRecordTypesDetected');
    }
    
    var { type } = stubs[0];
    // FIXME: fetch-record-type has a fixme here an im not sure why
    var crt = await fetchCRTSettings({
        db, collectionName: 'study', recordType: type, wrap: true
    });

    var records = await aggregateToArray({ db, study: [
        ...stages,
        ...SystemPermissionStages({ collection: 'study', permissions }),
    ]});
    // FIXME: question is should we 404 or 403 when access is denied?
    // well 404 for now and treat it as if it wasnt found kinda
    if (records.length < 1) {
        throw new ApiError(404, 'NoAccessibleRecordFound');
    }

    var labels = {};
    for (var it of records) {
         labels[it._id] = crt.getLabelForRecord({ record: it, i18n });
    }
    
    context.body = ResponseBody({ data: { labels } });
    await next();
}

module.exports = readManyLabels;
