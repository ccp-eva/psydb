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

    var { recordId } = request.body;

    var record = await withRetracedErrors(
        db.collection('rohrpostEvents').findOne({
            _id: recordId
        })
    );

    var related = await fetchRecordLabelsManual(db, {
        personnel: [ record.message.personnelId ],
        //[record.collectionName]: [ record.channelId ]
    });

    context.body = ResponseBody({
        data: { record, related },
    });
}

module.exports = readEndpoint;
