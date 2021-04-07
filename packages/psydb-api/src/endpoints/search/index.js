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

var search = async (context, next) => {
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
        collectionName,
        recordType,
        filter,
    } = request.body;

    if (
        !permissions.hasRootAccess
        && !permissions.canReadCollection(params.collectionName)
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

    var convertedFilter = convertConstraintsToMongoPath(filter);
    var records = await fetchRecordsByFilter({
        db,
        collectionName,
        hasSubChannels,
        filter,
        offset,
        limit
    });
}

module.exports = search;
