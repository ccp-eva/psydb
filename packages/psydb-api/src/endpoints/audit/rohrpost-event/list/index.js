'use strict';
var {
    validateOrThrow,
    ResponseBody,
    withRetracedErrors,
    aggregateToArray,
    fetchRecordLabelsManual,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var listEndpoint = async (context, next) => {
    var { db, permissions, request } = context;

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    })

    var {
        messageType,
        interval,
        personnelId,
        offset,
        limit
    } = request.body;

    var MATCH = {
        'message.type': new RegExp(messageType)
    };

    var total = await withRetracedErrors(
        db.collection('mqMessageHistory').countDocuments(MATCH)
    );

    var records = await withRetracedErrors(
        aggregateToArray({ db, mqMessageHistory: [
            { $match: MATCH },
            { $skip: offset },
            { $limit: limit  }
        ]})
    );

    var related = await fetchRecordLabelsManual(db, {
        personnelIds: records.map(it => it.personnelId)
    });

    context.body = ResponseBody({
        data: { records, related },
    });
}

module.exports = listEndpoint;
