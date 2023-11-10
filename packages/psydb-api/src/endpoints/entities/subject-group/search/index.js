'use strict';
var debug = require('debug')('psydb:api:endpoints:subjectGroup:search');
var { copy } = require('copy-anything');
var { keyBy } = require('@mpieva/psydb-core-utils');
var { fieldTypeMetadata } = require('@mpieva/psydb-common-lib');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    ApiError,
    validateOrThrow,
    ResponseBody,

    gatherAvailableConstraintsForRecordType,
    gatherDisplayFieldsForRecordType,
    fetchRecordsByFilter,
    convertFiltersToQueryFields, 
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');


var Schema = require('./schema');

var search = async (context, next) => {
    debug('subject-group/search');
    var collectionName = 'subjectGroup';
    var { db, permissions, request } = context;

    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    validateOrThrow({
        schema: Schema.Core(),
        payload: copy(request.body)
    })

    var { target = 'table' } = request.body;
    
    var availableConstraints = await (
        gatherAvailableConstraintsForRecordType({
            db, collectionName,
        })
    );
    var {
        displayFields,
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        db, collectionName, target,
    });
    
    validateOrThrow({
        schema: Schema.Full({
            availableConstraints,
            availableFilterFields: displayFields
        }),
        payload: request.body
    });
    
    var {
        filters,
        constraints,
        offset,
        limit,
        sort,
    } = request.body;
    
    var queryFields = convertFiltersToQueryFields({
        filters,
        displayFields,
        fieldTypeMetadata,
    });
    
    var { recordLabelDefinition } = allSchemaCreators.subjectGroup;

    debug('>>>>>>>>> START');
    var records = await fetchRecordsByFilter({
        db,
        permissions,
        collectionName,

        //enableResearchGroupFilter,
        constraints,
        queryFields,

        displayFields,
        recordLabelDefinition,
        offset,
        limit,
        sort,

        // TODO remove this as soon as we
        // can properly quicksearch and search for fk
        //disablePermissionCheck: (target === 'optionlist' ? true : false)
        disablePermissionCheck: true
    });
    debug('<<<<<<<<< END')
    
    var related = await fetchRelatedLabelsForMany({
        db,
        collectionName,
        records: records,
    });
    
    var availableDisplayFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer'
    });

    var displayFieldData = displayFields.map(it => ({
        ...availableDisplayFieldDataByPointer[it.dataPointer],
        dataPointer: it.dataPointer,
    }));

    context.body = ResponseBody({
        data: {
            ...related,
            displayFieldData,
            records,
            recordsCount: records.totalRecordCount
        },
    });
}

module.exports = { search };
