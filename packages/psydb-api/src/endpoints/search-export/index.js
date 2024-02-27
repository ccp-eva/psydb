'use strict';
var debug = require('debug')('psydb:api:endpoints:export');
var jsonpointer = require('jsonpointer');
var { copy } = require('copy-anything');

var { keyBy } = require('@mpieva/psydb-core-utils');
var { stringifyFieldValue } = require('@mpieva/psydb-common-lib');

var {
    ApiError,
    Ajv,
    ResponseBody,

    gatherAvailableConstraintsForRecordType,
    gatherDisplayFieldsForRecordType,
    
    fetchOneCustomRecordType,
    fetchRecordsByFilter,
    fetchRelatedLabelsForMany,

    convertFiltersToQueryFields,
    convertConstraintsToMongoPath,

    CSV,
} = require('@mpieva/psydb-api-lib');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');
var { fieldTypeMetadata } = require('@mpieva/psydb-common-lib');

var CoreBodySchema = require('./core-body-schema');
var FullBodySchema = require('./full-body-schema');

var exportEndpoint = async (context, next) => {
    debug('endpoints/export');
    var { db, permissions, request } = context;

    var ajv = Ajv();
    var precheckBody = copy(request.body);
    var isValidCore = ajv.validate(
        CoreBodySchema(),
        precheckBody
    );
    if (!isValidCore) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, 'InvalidRequestSchema');
    };
    
    var {
        collection,
        recordType,
    } = precheckBody;
    
    var collectionCreatorData = allSchemaCreators[collection];
    if (!collectionCreatorData) {
        throw new Error(
            `no creator data found for collection "${collection}"`
        );
    }

    var {
        displayFields,
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        db,
        collectionName: collection,
        customRecordType: recordType,
        target: 'table',
        permissions
    });
        
    var isValidFull = ajv.validate(
        await generateFullBodySchema(context, { displayFields }),
        request.body
    );
    if (!isValidCore) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, 'InvalidRequestSchema');
    };

    var {
        searchOptions = {},
        filters,
        constraints,
        sort,
        showHidden,

        timezone
    } = request.body;

    var {
        hasSubChannels,
        recordLabelDefinition,
    } = collectionCreatorData;

    if (recordType) {
        var crt = await fetchOneCustomRecordType({
            db, collection, type: recordType,
        });
        recordLabelDefinition = crt.state.recordLabelDefinition;
    }
    
    var {
        enableResearchGroupFilter = true,
    } = searchOptions;

    var queryFields = convertFiltersToQueryFields({
        filters,
        displayFields,
        fieldTypeMetadata,
    });

    debug('>>> start fetchRecords()');
    var records = await fetchRecordsByFilter({
        db,
        permissions,
        collectionName: collection,
        recordType,
        hasSubChannels,

        enableResearchGroupFilter,
        constraints,
        queryFields,

        displayFields,
        recordLabelDefinition,
        sort,
        showHidden,

        disablePermissionCheck: false
    });
    debug('<<< end fetchRecords()');

    debug('>>> start fetchRelated()');
    var related = await fetchRelatedLabelsForMany({
        db,
        collectionName: collection,
        recordType,
        records: records,
    });
    debug('<<< end fetchRelated()');

    var availableDisplayFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer'
    });

    var displayFieldData = displayFields.map(it => ({
        ...availableDisplayFieldDataByPointer[it.dataPointer],
        dataPointer: it.dataPointer,
    }))

    var csv = CSV();
    csv.addLine(displayFieldData.map(it => it.displayName));
    for (var record of records) {
        csv.addLine(displayFieldData.map(fieldDefinition => {
            var { dataPointer } = fieldDefinition;
            var rawValue = jsonpointer.get(record, dataPointer);
            
            var str = stringifyFieldValue({
                rawValue,
                fieldDefinition,
                ...related,

                timezone,
            });

            return str;
        }))
    }

    //console.log(csv.toString());
    context.body = csv.toString();

    await next();
}

var generateFullBodySchema = async (context, bag) => {
    var { db, request } = context;
    var { displayFields } = bag;
    
    var {
        collection,
        recordType,
    } = request.body;
    
    var availableConstraints = await (
        gatherAvailableConstraintsForRecordType({
            db,
            collectionName: collection,
            recordType,
        })
    );

    return FullBodySchema({
        availableConstraints,
        availableFilterFields: displayFields
    });
}

module.exports = exportEndpoint;
