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
        triggeredBy,
        interval,
        offset,
        limit
    } = request.body;

    var MATCH = {
        ...(messageType && {
            'message.type': new RegExp(messageType)
        }),
    };

    var total = await withRetracedErrors(
        db.collection('mqMessageHistory').countDocuments(MATCH)
    );

    var records = await withRetracedErrors(
        aggregateToArray({ db, mqMessageHistory: [
            ...(Object.keys(MATCH).length > 0 ? [ 
                { $match: MATCH }
            ] : []),
            { $skip: offset },
            { $limit: limit  }
        ]})
    );

    var related = await fetchRecordLabelsManual(db, {
        personnel: records.map(it => it.personnelId)
    });

    context.body = ResponseBody({
        data: { records, total, related },
    });
}

module.exports = listEndpoint;
