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
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body'),
    keyBy = require('@mpieva/psydb-api-lib/src/key-by');

var CoreBodySchema = require('./core-body-schema'),
    FullBodySchema = require('./full-body-schema');

var fetchCustomRecordType = require('@mpieva/psydb-api-lib/src/fetch-custom-record-type');
var fetchRecordsByFilter = require('@mpieva/psydb-api-lib/src/fetch-records-by-filter');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var convertConstraintsToMongoPath = require('@mpieva/psydb-api-lib/src/convert-constraints-to-mongo-path');

var fieldTypeMetadata = require('./field-type-metadata');

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

    if (
        !permissions.hasRootAccess
        && !permissions.canReadCollection(collectionName)
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
        hasCustomTypes,
        hasSubChannels,
    } = collectionCreatorData;

    var displayFields = undefined;
    if (hasCustomTypes) {
        var customRecordType = await fetchCustomRecordType({
            db,
            collection: collectionName,
            type: recordType,
        });

        displayFields = customRecordType.state[
            target === 'optionlist'
            ? 'optionListDisplayFields'
            : 'tableDisplayFields'
        ];
    }
    else {
        // TODO
        displayFields = [];
    }

    isValid = ajv.validate(
        FullBodySchema({
            availableFilterFields: displayFields
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
        filters,
        offset,
        limit,
    } = request.body;

    var displayFieldsByDataPointer = keyBy({
        items: displayFields,
        byProp: 'dataPointer'
    });

    /*var convertedFilters = (
        convertConstraintsToMongoPath(filters)
    );*/

    //console.log(convertedFilters);

    var queryFields = [];
    for (var dataPointer of Object.keys(filters)) {
        var value = filters[dataPointer];
        var displayField = displayFieldsByDataPointer[dataPointer];
        var metadata = fieldTypeMetadata[displayField.systemType];

        queryFields.push({
            systemType: displayField.systemType,
            searchType: metadata.searchType,
            dataPointer,
            value
        });
    }

    //console.log(queryFields);

    var records = await fetchRecordsByFilter({
        db,
        permissions,
        collectionName,
        hasSubChannels,
        fields: queryFields,
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
