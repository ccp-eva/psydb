// - check permissions
//     <- collection = unrestricted, record-restricted

// - fetch customTypes for that collection
// - create all schemas that can be in that collection
// - gather all fields that contain foreignKeys from the schema
//
// - fetch the records from db
//
// if fk values should be fetched
//     - iterate every record
//     - when record has a key that matches a foreign key path
//       add the value to a field specific list
// 
// for each fks that have values gathered fetch the
// related values from the target collection

'use strict';
var debug = require('debug')('psydb:api:endpoints:search');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv'),
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var CoreBodySchema = require('./core-body-schema'),
    FullBodySchema = require('./full-body-schema');

var fetchCustomRecordType = require('@mpieva/psydb-api-lib/src/fetch-custom-record-type');
var fetchRecordsByFilter = require('@mpieva/psydb-api-lib/src/fetch-records-by-filter');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var convertConstraintsToMongoPath = require('@mpieva/psydb-api-lib/src/convert-constraints-to-mongo-path');

var search = async (context, next) => {
    var { 
        db,
        permissions,
        request
    } = context;

    var ajv = Ajv(),
        isValid = false;

    isValid = ajv.validate(
        CoreBodySchema(),
        request.body
    );
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, 'InvalidRequestSchema');
    };

    var {
        collectionName,
        recordType,
        target,
    } = request.body;

    target = target || 'table';

    var customRecordType = await fetchCustomRecordType({
        db,
        collection: collectionName,
        type: recordType,
    });

    isValid = ajv.validate(
        FullBodySchema({
            availableFilterFields: customRecordType.state[
                target === 'optionlist'
                ? 'optionListDisplayFields'
                : 'tableDisplayFields'
            ]
        }),
        request.body
    );
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, 'InvalidRequestSchema');
    }
    
    var {
        collectionName,
        recordType,
        filter,
        offset,
        limit,
    } = request.body;

    if (
        !permissions.hasRootAccess
        && !permissions.canReadCollection(params.collectionName)
    ) {
        throw new ApiError(403, 'CollectionAccessDenied');
    }

    var collectionCreatorData = allSchemaCreators[collectionName];
    if (!collectionCreatorData) {
        throw new Error(
            `no creator data found for collection "${collectionName}"`
        );
    }

    var {
        hasSubChannels,
    } = collectionCreatorData;
    
    var convertedFilter = convertConstraintsToMongoPath(filter);

    var records = await fetchRecordsByFilter({
        db,
        permissions,
        collectionName,
        hasSubChannels,
        filter,
        offset,
        limit
    });
    
    context.body = ResponseBody({
        data: {
            records,
        },
    });

    await next();
}

module.exports = search;
