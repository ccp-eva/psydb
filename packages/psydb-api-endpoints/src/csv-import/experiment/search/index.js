'use strict';
// XXX: stub
var debug = require('debug')(
    'psydb:api:endpoints:csvImport:experiment:search'
);

var { only } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var {
    ResponseBody,
    validateOrThrow,
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

    var records = await aggregateToArray({ db, csvImport: [
        { $match: {
            type: /^experiment\//
        }},
        { $sort: {
            createdAt: -1
        }}
    ]});

    var relatedRecordLabels = await fetchRecordLabelsManual(db, {
        study: records.map(it => it.studyId),
        personnel: records.map(it => it.createdBy),
    }, { oldWrappedLabels: false, ...i18n });

    context.body = ResponseBody({ data: {
        records,
        related: { records: relatedRecordLabels }
    }})
    
    await next();
}

module.exports = search;

