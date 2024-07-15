'use strict';
// XXX: stub
var debug = require('debug')(
    'psydb:api:endpoints:csvImport:subject:read'
);

var { only, jsonpointer } = require('@mpieva/psydb-core-utils');
var {
    ResponseBody,
    validateOrThrow,
    withRetracedErrors,
    aggregateOne,
    aggregateToArray,
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
        personnel: [ record.createdBy ],
    }, { oldWrappedLabels: false, ...i18n });

    // FIXME: create utility to fetch related manually
    var relatedCRTRecords = await aggregateToArray({ db, customRecordType: [
        { $match: {
            collection: 'subject',
            type: record?.subjectType
        }},
        { $project: {
            'collection': true,
            'type': true,
            'state.label': true,
            'state.displayNameI18N': true,
        }}
    ]});
    var relatedCRTs = {};
    for (var it of relatedCRTRecords) {
        var { collection, type, state } = it;
        jsonpointer.set(relatedCRTs, `/${collection}/${type}`, state);
    }
    context.body = ResponseBody({ data: {
        record,
        related: {
            records: relatedRecordLabels,
            crts: relatedCRTs
        }
    }})
    
    await next();
}

module.exports = read;

