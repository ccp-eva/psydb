'use strict';
// XXX: stub
var debug = require('debug')(
    'psydb:api:endpoints:csvImport:experiment:read'
);

var { only } = require('@mpieva/psydb-core-utils');
var {
    ResponseBody,
    validateOrThrow,
    withRetracedErrors,
    aggregateOne,
    fetchRecordLabelsManual,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var read = async (context, next) => {
    var { db, permissions, request } = context;
    
    var i18n = only({ from: context, keys: [
        'language', 'locale', 'timezone'
    ]});

    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }
    
    validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    var { id: csvImportId } = request.body;

    var record = await withRetracedErrors(
        aggregateOne({ db, csvImport: [
            { $match: {
                _id: csvImportId
            }},
        ]})
    );

    var relatedRecordLabels = await fetchRecordLabelsManual(db, {
        study: [ record.studyId ],
        personnel: [ record.createdBy ],
    }, { oldWrappedLabels: false, ...i18n });

    context.body = ResponseBody({ data: {
        record,
        related: { records: relatedRecordLabels }
    }})
    
    await next();
}

module.exports = read;

