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

var { copy } = require('copy-anything');
var { keyBy, entries } = require('@mpieva/psydb-core-utils');
var { fieldTypeMetadata } = require('@mpieva/psydb-common-lib');
var {
    ApiError,
    Ajv,
    ResponseBody,

    gatherAvailableConstraintsForRecordType,
    gatherDisplayFieldsForRecordType,
    fetchOneCustomRecordType,
    fetchRecordsByFilter,
    convertFiltersToQueryFields, 
    convertConstraintsToMongoPath,
    fetchRelatedLabelsForMany,

} = require('@mpieva/psydb-api-lib');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var CoreBodySchema = require('./core-body-schema');
var FullBodySchema = require('./full-body-schema');

// NOTE https://github.com/ajv-validator/ajv/issues/242
// i assume having it outside the thingy is find then?
// saves ~60ms
var ajv = Ajv();

var search = async (context, next) => {
    debug('endpoints/search');
    var { 
        db,
        permissions,
        request
    } = context;

    var isValid = false;

    debug('start validating');

    var precheckBody = copy(request.body);
    isValid = ajv.validate(
        CoreBodySchema(),
        precheckBody
    );
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, 'InvalidRequestSchema');
    };

    var {
        collectionName,
        recordType,
        target,
        showHidden,
    } = precheckBody;
    
    target = target || 'table';

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
        customRecordType: recordType,
        target,
        permissions
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
    debug('done validating');
    
    var {
        collectionName,
        recordType,
        searchOptions = {},
        filters,
        extraIds,
        excludedIds,
        constraints,
        offset,
        limit,
        sort,
    } = request.body;

    // FIXME: thtas a hotfixed for $in in constraint values
    constraints = entries(constraints).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: Array.isArray(value) ? { $in: value } : value
    }), {});

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

    var {
        enableResearchGroupFilter = true,
    } = searchOptions;

    var onlyIds = undefined;
    if (target === 'optionlist' && collectionName === 'researchGroup') {
        onlyIds = permissions.getResearchGroupIds();
    }
    if (target === 'optionlist' && collectionName === 'systemRole') {
        if (!permissions.isRoot()) {
            onlyIds = permissions.availableSystemRoleIds;
        }
    }
    debug('>>>>>>>>> START');
    var records = await fetchRecordsByFilter({
        db,
        permissions,
        collectionName,
        recordType,
        hasSubChannels,

        enableResearchGroupFilter,
        onlyIds,
        extraIds,
        excludedIds,
        constraints,
        queryFields,

        displayFields,
        recordLabelDefinition,
        offset,
        limit,
        sort,

        showHidden,
        // TODO remove this as soon as we
        // can properly quicksearch and search for fk
        //disablePermissionCheck: (target === 'optionlist' ? true : false)
    });
    debug('<<<<<<<<< END')

    //console.dir(records, { depth: null });

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
