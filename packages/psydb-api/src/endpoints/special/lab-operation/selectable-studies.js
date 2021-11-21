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
    validateOrThrow,
    ApiError,
    ResponseBody,
} = require('@mpieva/psydb-api-lib');

var fetchRecordsByFilter = require('@mpieva/psydb-api-lib/src/fetch-records-by-filter');
var gatherDisplayFieldsForRecordType = require('@mpieva/psydb-api-lib/src/gather-display-fields-for-record-type');
var fetchOneCustomRecordType = require('@mpieva/psydb-api-lib/src/fetch-one-custom-record-type');
var fetchRelatedLabelsForMany = require('@mpieva/psydb-api-lib/src/fetch-related-labels-for-many');

var {
    ExactObject,
    DefaultArray,
    StringEnum,
    CustomRecordTypeKey,
    ExperimentVariantEnum,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ({
    oneOf: [
        ExactObject({
            properties: {
                studyRecordType: CustomRecordTypeKey({ collection: 'study' }),
                target: StringEnum([ 'table', 'optionlist' ])
            },
            required: [
                'studyRecordType',
            ]
        }),
        ExactObject({
            properties: {
                studyRecordType: CustomRecordTypeKey({ collection: 'study' }),
                // FIXME: this is actually labProcedureType
                experimentType: ExperimentVariantEnum(),
                target: StringEnum([ 'table', 'optionlist' ])
            },
            required: [
                'studyRecordType',
                'experimentType',
            ]
        }),
        ExactObject({
            properties: {
                studyRecordType: CustomRecordTypeKey({ collection: 'study' }),
                // FIXME: this is actually labProcedureTypes
                experimentTypes: DefaultArray({
                    items: ExperimentVariantEnum(),
                    minItems: 1
                }),
                target: StringEnum([ 'table', 'optionlist' ])
            },
            required: [
                'studyRecordType',
                'experimentTypes',
            ]
        }),
    ]
});

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
    } = request.body

    // TODO: permissions

    if (labProcedureType) {
        labProcedureTypes = [ labProcedureType ];
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
            ]
        }},
    ];

    var records = await fetchRecordsByFilter({
        db,
        permissions,
        collectionName: 'study',
        recordType: studyRecordType,
        displayFields,
        recordLabelDefinition,
        additionalPreprocessStages,
        target,
        //offset,
        //limit
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
