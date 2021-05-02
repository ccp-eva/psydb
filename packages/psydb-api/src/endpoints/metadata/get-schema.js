'use strict';
var debug = require('debug')('psydb:api:endpoints:metadata');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');
var createSchemaForRecordType = require('@mpieva/psydb-api-lib/src/create-schema-for-record-type');
var fetchCustomRecordTypes = require('@mpieva/psydb-api-lib/src/fetch-custom-record-types');

var getSchema = async (context, next) => {
    var {
        db,
        params,
        query,
    } = context;

    var {
        collectionName,
        recordType
    } = params;

    // TODO: check params

    var collectionCreatorData = allSchemaCreators[collectionName];
    if (!collectionCreatorData || collectionName === 'customRecordType') {
        throw new ApiError(400, 'InvalidCollection');
    }

    var {
        hasCustomTypes
    } = collectionCreatorData;

    // FIXME: we might be able to check that
    // via param schema
    if (hasCustomTypes && !recordType) {
        throw new ApiError(400, 'RecordTypeRequired');
    }

    var additionalSchemaCreatorArgs = {
        // FIXME: so i kinda wanna disable it some of the times
        // because we dont want to update them directly
        // but there are instances where i need to read them
        // so this is a bit inconsistent since we actually
        // get the internals data from reading the record
        enableInternalProps: false,
    };
    
    var recordSchema = await createSchemaForRecordType({
        db,
        collectionName: collectionName,
        recordType: recordType,
        fullSchema: true,
        additionalSchemaCreatorArgs,
    });

    context.body = ResponseBody({
        data: recordSchema
    });

    await next();
}

module.exports = getSchema;
