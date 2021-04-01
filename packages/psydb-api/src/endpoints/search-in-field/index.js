'use strict';
var debug = require('debug')('psydb:api:endpoints:searchInField');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var RequestBodySchema = require('./request-body-schema');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var createSchemaForRecord =
    require('@mpieva/psydb-api-lib/src/create-schema-for-record');

var fetchRecordById = require('@mpieva/psydb-api-lib/src/fetch-record-by-id');

var resolveDataPointer = require('./resolve-data-pointer');

var searchInField = async (context, next) => {
    var { 
        db,
        permissions,
        request
    } = context;

    var ajv = Ajv();
    var isValid = ajv.validate(RequestBodySchema(), request.body);
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, 'InvalidRequestSchema');
    }
    
    var {
        contextCollectionName,
        contextRecordId,
        fieldPointer,
        additionalFilter,
    } = request.body;

    if (
        !permissions.hasRootAccess
        && !permissions.canReadCollection(contextCollectionName)
    ) {
        throw new ApiError(403, 'CollectionAccessDenied');
    }

    var collectionCreatorData = allSchemaCreators[contextCollectionName];
    if (!collectionCreatorData) {
        throw new Error(
            `no creator data found for collection "${contextCollectionName}"`
        );
    }
    
    var {
        hasSubChannels,
    } = collectionCreatorData;

    var record = await fetchRecordById({
        db,
        collectionName: contextCollectionName,
        id: contextRecordId,
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
        collectionName: contextCollectionName,
        record,
        fullSchema: true
    });
    
    var resolved = resolveDataPointer({
        schema: recordSchema,
        pointer: fieldPointer
    });

    console.log(resolved);
}

module.exports = searchInField;
