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
    keyBy = require('@mpieva/psydb-common-lib/src/key-by');

var CoreBodySchema = require('./core-body-schema'),
    FullBodySchema = require('./full-body-schema');

var gatherAvailableConstraintsForRecordType = require('@mpieva/psydb-api-lib/src/gather-available-constraints-for-record-type');
var gatherDisplayFieldsForRecordType = require('@mpieva/psydb-api-lib/src/gather-display-fields-for-record-type');
var fetchOneCustomRecordType = require('@mpieva/psydb-api-lib/src/fetch-one-custom-record-type');
var fetchRecordsByFilter = require('@mpieva/psydb-api-lib/src/fetch-records-by-filter');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var convertFiltersToQueryFields = require('@mpieva/psydb-api-lib/src/convert-filters-to-query-fields');
var convertConstraintsToMongoPath = require('@mpieva/psydb-api-lib/src/convert-constraints-to-mongo-path');
var fetchRelatedLabelsForMany = require('@mpieva/psydb-api-lib/src/fetch-related-labels-for-many');

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

    var availableConstraints = await (
        gatherAvailableConstraintsForRecordType({
            db,
            collectionName,
            recordType,
        })
    );

    var {
        displayFields,
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        db,
        collectionName,
        customRecordType: recordType
    });

    isValid = ajv.validate(
        FullBodySchema({
            availableConstraints,
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
        constraints,
        offset,
        limit,
    } = request.body;

    var queryFields = convertFiltersToQueryFields({
        filters,
        displayFields,
        fieldTypeMetadata,
    });

    var {
        hasSubChannels,
        recordLabelDefinition,
    } = collectionCreatorData;

    if (recordType) {
        var customRecordTypeData = await fetchOneCustomRecordType({
            db,
            collection: collectionName,
            type: recordType,
        });

        recordLabelDefinition = (
            customRecordTypeData.state.recordLabelDefinition
        );
    }

    var records = await fetchRecordsByFilter({
        db,
        permissions,
        collectionName,
        recordType,
        hasSubChannels,

        constraints,
        queryFields,

        displayFields,
        recordLabelDefinition,
        offset,
        limit
    });

    var related = await fetchRelatedLabelsForMany({
        db,
        collectionName,
        recordType,
        records: records,
    });

    var availableDisplayFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer'
    });

    var displayFieldData = displayFields.map(it => ({
        ...availableDisplayFieldDataByPointer[it.dataPointer],
        dataPointer: it.dataPointer,
    }))

    context.body = ResponseBody({
        data: {
            ...related,
            displayFieldData,
            records,
            recordsCount: records.totalRecordCount
        },
    });

    await next();
}

module.exports = search;
