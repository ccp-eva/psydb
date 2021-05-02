'use strict';
var debug = require('debug')('psydb:api:endpoints:read');

var inlineString = require('@cdxoo/inline-string');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var createSchemaForRecord =
    require('@mpieva/psydb-api-lib/src/create-schema-for-record');

var fetchOneCustomRecordType = require('@mpieva/psydb-api-lib/src/fetch-one-custom-record-type');
var fetchRecordById = require('@mpieva/psydb-api-lib/src/fetch-record-by-id');

var fetchRelatedLabels = require('@mpieva/psydb-api-lib/src/fetch-related-labels');


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
        var customRecordType = await fetchOneCustomRecordType({
            db,
            collection: collectionName,
            type: recordType,
        });
        
        recordLabelDefinition = (
            customRecordType.state.recordLabelDefinition
        );
    }

    var record = await fetchRecordById({
        db,
        collectionName: collectionName,
        id: id,
        hasSubChannels,
        permissions,
        recordLabelDefinition,
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

    var {
        relatedRecords,
        relatedHelperSetItems,
        relatedCustomRecordTypes,
    } = await fetchRelatedLabels({
        db,
        data: record,
        schema: recordSchema,
    });

    context.body = ResponseBody({
        data: {
            record,
            relatedRecordLabels: relatedRecords,
            relatedHelperSetItems,
            relatedCustomRecordTypeLabels: relatedCustomRecordTypes,
        }
    });

    await next();
}

module.exports = read;
