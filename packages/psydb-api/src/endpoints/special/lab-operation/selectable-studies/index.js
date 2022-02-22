'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:selectableStudies'
);

var {
    keyBy,
    unique,
    compareIds,
} = require('@mpieva/psydb-core-utils');

var {
    ApiError,
    ResponseBody,
    validateOrThrow,
    
    fetchRecordsByFilter,
    gatherDisplayFieldsForRecordType,
    fetchOneCustomRecordType,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');


var convertFiltersToQueryFields = require('@mpieva/psydb-api-lib/src/convert-filters-to-query-fields');
var fieldTypeMetadata = require('@mpieva/psydb-common-lib/src/field-type-metadata');

var RequestBodySchema = require('./body-schema');

var selectableStudies = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    });

    var {
        studyRecordType,
        experimentType: labProcedureType,
        experimentTypes: labProcedureTypes,
        target,
        filters = {},
    } = request.body


    if (labProcedureType) {
        labProcedureTypes = [ labProcedureType ];
    }

    // FIXME: we need to provide which context we want the study list in
    // i.e. reservation/suject-selection so that we apply the correct
    // flag here
    var userResearchGroupIds = permissions.getAllLabOperationFlagIds({
        types: labProcedureTypes,
        flags: [ 'canWriteReservation', 'canSelectSubjectsForExperiments' ]
    });
    var isAllowed = permissions.hasSomeLabOperationFlags({
        types: labProcedureTypes,
        flags: [ 'canWriteReservation', 'canSelectSubjectsForExperiments' ]
    });
    if (!isAllowed) {
        throw new ApiError(403, {
            apiStatus: 'LabOperationAccessDenied',
            data: {
                labProcedureTypes,
                flags: [
                    'canWriteReservations',
                    'canSelectSubjectsForExperiments',
                ],
                checkJoin: 'or',
            }
        })
    }

    var customRecordTypeData = await fetchOneCustomRecordType({
        db,
        collection: 'study',
        type: studyRecordType,
    });

    var {
        displayFields,
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        db,
        collectionName: 'study',
        customRecordType: studyRecordType,
        target,
    });

    var recordLabelDefinition = (
        customRecordTypeData.state.recordLabelDefinition
    );

    var now = new Date();
    var additionalPreprocessStages = [
        { $match: {
            $or: [
                {
                    'state.runningPeriod.start': { $lte: now },
                    'state.runningPeriod.end': { $gte: now }
                },
                {
                    'state.runningPeriod.start': { $lte: now },
                    'state.runningPeriod.end': { $type: 10 }, // null
                }
            ],
            // FIXME: we need to actally evaluate if research group is forced
            ...(!permissions.isRoot() && {
                'state.researchGroupIds': { $in: userResearchGroupIds }
            })
        }},
    ];

    var queryFields = convertFiltersToQueryFields({
        filters,
        displayFields,
        fieldTypeMetadata,
    });

    // FIXME: this is not fully correct
    // we actually need to limit to studies that involve
    // researchgroupds the user belongs to
    var records = await fetchRecordsByFilter({
        db,
        permissions,
        collectionName: 'study',
        recordType: studyRecordType,
        displayFields,
        recordLabelDefinition,
        additionalPreprocessStages,
        target,
        queryFields,
        //offset,
        //limit
        
        disablePermissionCheck: true,
    });

    var settingRecords = await (
        db.collection('experimentVariantSetting').aggregate([
            { $match: {
                studyId: { $in: records.map(it => it._id) },
                type: { $in: labProcedureTypes }
            }},
            { $project: { _id: true, studyId: true }},
        ]).toArray()
    );

    var studyIdsWithSettings = unique(
        settingRecords.map(it => String(it.studyId))
    );

    records = records.filter(study => (
        studyIdsWithSettings.includes(String(study._id))
    ));

    var related = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'study',
        recordType: studyRecordType,
        records,
    })

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
            records,
            displayFieldData,
            ...related
        },
    });


    await next();
}

module.exports = selectableStudies;
