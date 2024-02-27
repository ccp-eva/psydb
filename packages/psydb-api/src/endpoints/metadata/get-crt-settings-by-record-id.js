'use strict';
var debug = require('debug')('psydb:api:endpoints:metadata');
var { isInstanceOf } = require('@mpieva/psydb-core-utils');

var ERR = require('@mpieva/psydb-api-lib-errors');

var {
    ApiError,
    ResponseBody,
    validateOrThrow,
    fetchCRTSettings,
} = require('@mpieva/psydb-api-lib');

var {
    ClosedObject,
    CollectionEnum,
    Id,
} = require('@mpieva/psydb-schema-fields');

var ParamsSchema = () => ClosedObject({
    collection: CollectionEnum(),
    id: Id(),
});

var getCRTSettingsByRecordId = async (context, next) => {
    var { db, params } = context;

    validateOrThrow({
        schema: ParamsSchema(),
        payload: params
    });
    
    var { collection, id } = params;

    var record = await db.collection(collection).findOne({
        _id: id
    });
    if (!record) {
        throw new ApiError(404, 'NotFound');
    }
    
    try {
        var data = await fetchCRTSettings({
            db,
            collectionName: collection,
            recordType: record.type
        });
        context.body = ResponseBody({ data });
    }
    catch (e) {
        var should400 = isInstanceOf(e, [
            ERR.InvalidCollection,
            ERR.RecordTypeRequired,
            ERR.RecordTypeNotFound
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

module.exports = getCRTSettingsByRecordId;
