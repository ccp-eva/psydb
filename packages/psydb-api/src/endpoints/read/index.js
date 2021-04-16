'use strict';
var debug = require('debug')('psydb:api:endpoints:read');

var inlineString = require('@cdxoo/inline-string');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var createSchemaForRecord =
    require('@mpieva/psydb-api-lib/src/create-schema-for-record');

var fetchCustomRecordType = require('@mpieva/psydb-api-lib/src/fetch-custom-record-type');
var fetchRecordById = require('@mpieva/psydb-api-lib/src/fetch-record-by-id');

var resolveForeignIdData = require('./resolve-foreign-id-data');

var fetchRelatedRecords = require('./fetch-related-records');


var read = async (context, next) => {
    var { 
        db,
        permissions,
        params,
        query,
    } = context;

    var {
        collectionName,
        recordType,
        id,
    } = params;

    // TODO: check param format

    if (
        !permissions.hasRootAccess
        && !permissions.canReadCollection(collectionName)
    ) {
        throw new ApiError(403, 'CollectionAccessDenied');
    }

    //console.dir(addSystemPermissionStages({ permissions }), { depth: null });

    var collectionCreatorData = allSchemaCreators[collectionName];
    if (!collectionCreatorData) {
        throw new Error(
            `no creator data found for collection "${collectionName}"`
        );
    }
    
    var {
        hasCustomTypes,
        hasSubChannels,
        recordLabelDefinition,
    } = collectionCreatorData;

    if (hasCustomTypes) {
        var customRecordType = await fetchCustomRecordType({
            db,
            collection: collectionName,
            type: recordType,
        });
    }

    var record = await fetchRecordById({
        db,
        collectionName: collectionName,
        id: id,
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
        collectionName: collectionName,
        record,
        fullSchema: true
    });
    
    var foreignIdData = resolveForeignIdData({
        schema: recordSchema,
        data: record,
    });

    //console.log(foreignIdData);

    var relatedRecordLabels = await fetchRelatedRecords({
        db,
        foreignIdData,
        labelOnly: true
    });

    context.body = ResponseBody({
        data: {
            //recordSchema,
            record,
            relatedRecordLabels,
        }
    });

    await next();
}

module.exports = read;
