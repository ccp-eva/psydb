'use strict';
// XXX: stub
var debug = require('debug')(
    'psydb:api:endpoints:csvImport:subject:search'
);

var { only, jsonpointer } = require('@mpieva/psydb-core-utils');
var {
    ResponseBody,
    validateOrThrow,
    withRetracedErrors,
    aggregateToArray,
    fetchRecordLabelsManual,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var search = async (context, next) => {
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

    var records = await withRetracedErrors(
        aggregateToArray({ db, csvImport: [
            { $match: {
                type: /^subject\//
            }}
        ]})
    );

    var relatedRecordLabels = await fetchRecordLabelsManual(db, {
        personnel: records.map(it => it.createdBy),
    }, { oldWrappedLabels: false, ...i18n });

    // FIXME: create utility to fetch related manually
    var relatedCRTRecords = await aggregateToArray({ db, customRecordType: [
        { $match: {
            collection: 'subject',
            type: { $in: records.map(it => it.subjectType)}
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
        records,
        related: {
            records: relatedRecordLabels,
            crts: relatedCRTs
        }
    }})
    
    await next();
}

module.exports = search;

