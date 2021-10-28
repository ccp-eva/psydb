'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:selectableStudies'
);

var { keyBy, unique } = require('@mpieva/psydb-common-lib');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv'),
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var fetchRecordsByFilter = require('@mpieva/psydb-api-lib/src/fetch-records-by-filter');
var gatherDisplayFieldsForRecordType = require('@mpieva/psydb-api-lib/src/gather-display-fields-for-record-type');
var fetchOneCustomRecordType = require('@mpieva/psydb-api-lib/src/fetch-one-custom-record-type');
var fetchRelatedLabelsForMany = require('@mpieva/psydb-api-lib/src/fetch-related-labels-for-many');
var compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var {
    ExactObject,
    DefaultArray,
    CustomRecordTypeKey,
    ExperimentVariantEnum,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ({
    oneOf: [
        ExactObject({
            properties: {
                studyRecordType: CustomRecordTypeKey({ collection: 'study' }),
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

    var ajv = Ajv(),
        isValid = false;

    isValid = ajv.validate(
        RequestBodySchema(),
        request.body
    );
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, {
            apiStatus: 'InvalidRequestSchema',
            data: { ajvErrors: ajv.errors }
        });
    };

    var {
        studyRecordType,
        experimentType: labProcedureType,
        experimentTypes: labProcedureTypes,
    } = request.body

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
        customRecordType: studyRecordType
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
        //offset,
        //limit
    });

    var settingRecords = await (
        db.collection('experimentVariantSetting').aggregate([
            { $match: {
                //studyId: { $in: records.map(it => it._id) },
                //type: { $in: labProcedureTypes }
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
