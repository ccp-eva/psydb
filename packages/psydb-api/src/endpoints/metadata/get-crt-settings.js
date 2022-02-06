'use strict';
var debug = require('debug')('psydb:api:endpoints:metadata');
var { isInstanceOf } = require('@mpieva/psydb-core-utils');

var {
    InvalidCollection,
    RecordTypeRequired,
    RecordTypeNotFound
} = require('@mpieva/psydb-api-lib-errors');

var {
    ApiError,
    ResponseBody,
    fetchCRTSettings,
} = require('@mpieva/psydb-api-lib');

var getCRTSettings = async (context, next) => {
    var { db, params, query } = context;
    var { collectionName, recordType } = params;

    try {
        var data = await fetchCRTSettings({
            db,
            collectionName,
            recordType
        });
        context.body = ResponseBody({ data });
    }
    catch (e) {
        var should400 = isInstanceOf(e, [
            InvalidCollection,
            RecordTypeRequired,
            RecordTypeNotFound
        ]);
        if (should400) {
            throw ApiError.from(400, e)
        }
        else {
            throw e;
        }
    }
    await next();
}

module.exports = getCRTSettings;
