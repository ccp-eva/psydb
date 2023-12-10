'use strict';
var {
    validateOrThrow,
    ResponseBody,
    withRetracedErrors,
    aggregateToArray,
    fetchRecordLabelsManual,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var readEndpoint = async (context, next) => {
    var { db, permissions, request } = context;

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    })

    var { correlationId } = request.body;

    var record = await withRetracedErrors(
        db.collection('mqMessageHistory').findOne({
            _id: correlationId
        })
    );

    var related = await fetchRecordLabelsManual(db, {
        personnel: [ record.personnelId ]
    });

    context.body = ResponseBody({
        data: { record, related },
    });
}

module.exports = readEndpoint;
