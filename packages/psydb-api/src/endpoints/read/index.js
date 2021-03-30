'use strict';
var debug = require('debug')('psydb:api:endpoints:read');

var inlineString = require('@cdxoo/inline-string');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var createSchemaForRecord =
    require('@mpieva/psydb-api-lib/src/create-schema-for-record');

var fetchRecordById = require('./fetch-record-by-id');

var resolveForeignIdData = require('./resolve-foreign-id-data');

var fetchRelatedRecords = require('./fetch-related-records');


var read = async (context, next) => {
    var { 
        db,
        permissions,
        params,
        query,
    } = context;

    // TODO: check param format

    if (
        !permissions.hasRootAccess
        && !permissions.canReadCollection(params.collectionName)
    ) {
        throw new ApiError(403, 'CollectionAccessDenied');
    }

    //console.dir(addSystemPermissionStages({ permissions }), { depth: null });

    var collectionCreatorData = allSchemaCreators[params.collectionName];
    if (!collectionCreatorData) {
        throw new Error(
            `no creator data found for collection "${params.collectionName}"`
        );
    }
    
    var {
        hasSubChannels,
    } = collectionCreatorData;

    var record = await fetchRecordById({
        db,
        collectionName: params.collectionName,
        id: params.id,
        hasSubChannels,
        permissions,
    });

    // FIXME: question is should we 404 or 403 when access is denied?
    // well 404 for now and treat it as if it wasnt found kinda
    if (!record) {
        throw new ApiError(404, 'NoAccessibleRecordFound');
    }

    var recordSchema = await createSchemaForRecord({
        db,
        collectionName: params.collectionName,
        record,
        fullSchema: true
    });
    
    var foreignIdData = resolveForeignIdData({
        schema: recordSchema,
        data: record,
    });

    //console.log(foreignIdData);

    await fetchRelatedRecords({
        db,
        foreignIdData,
        labelOnly: true
    });

    await next();
}

module.exports = read;
