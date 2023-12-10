'use strict';
var { escapeRX } = require('@mpieva/psydb-core-utils');
var {
    validateOrThrow,
    ResponseBody,
    withRetracedErrors,
    aggregateToArray,
    fetchRecordLabelsManual,
    SmartArray,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var listEndpoint = async (context, next) => {
    var { db, permissions, request } = context;

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    })

    var {
        correlationId,
        messageType,
        triggeredBy,
        interval,
        offset,
        limit
    } = request.body;

    var AND = SmartArray([
        correlationId && { $regexMatch: {
            input: '$_id',
            regex: new RegExp(escapeRX(correlationId), 'i')
        }},
        messageType && { $regexMatch: {
            input: '$message.type',
            regex: new RegExp(escapeRX(messageType), 'i')
        }},
        triggeredBy && { $eq: [
            '$personnelId', triggeredBy,
        ]},
        // interval && { ... } // TODO
    ]);

    var MATCH = (
        AND.length > 0
        ? { $expr: { $and: AND }}
        : undefined
    );

    var total = await withRetracedErrors(
        db.collection('mqMessageHistory').countDocuments(MATCH)
    );

    var records = await withRetracedErrors(
        aggregateToArray({ db, mqMessageHistory: SmartArray([
            MATCH && { $match: MATCH },
            { $skip: offset },
            { $limit: limit  }
        ])})
    );

    var related = await fetchRecordLabelsManual(db, {
        personnel: records.map(it => it.personnelId)
    });

    context.body = ResponseBody({
        data: { records, total, related },
    });
}

module.exports = listEndpoint;
