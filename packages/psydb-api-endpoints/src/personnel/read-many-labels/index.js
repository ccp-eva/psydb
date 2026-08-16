'use strict';
var { SRTSettings } = require('@mpieva/psydb-common-lib');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { match, SystemPermissionStages }
    = require('@mpieva/psydb-mongo-stages');
var { ApiError, ResponseBody, validateOrThrow }
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

    var stubs = await aggregateToArray({ db, personnel: [
        ...stages
    ]});
    if (stubs.length < 1) {
        throw new ApiError(404, 'NoAccessibleRecordFound');
    }

    var records = await aggregateToArray({ db, personnel: [
        ...stages,
        ...SystemPermissionStages({ collection: 'personnel', permissions }),
    ]});
    // FIXME: question is should we 404 or 403 when access is denied?
    // well 404 for now and treat it as if it wasnt found kinda
    if (records.length < 1) {
        throw new ApiError(404, 'NoAccessibleRecordFound');
    }

    var srt = SRTSettings({ collection: 'personnel' });
    var labels = {};
    for (var it of records) {
         labels[it._id] = srt.getLabelForRecord({ record: it, i18n });
    }
    
    context.body = ResponseBody({
        data: { labels }
    });

    await next();
}

module.exports = readManyLabels;
