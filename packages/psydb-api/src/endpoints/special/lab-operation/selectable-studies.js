'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:selectableStudies'
);

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv'),
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body'),
    keyBy = require('@mpieva/psydb-common-lib/src/key-by');

var fetchRecordsByFilter = require('@mpieva/psydb-api-lib/src/fetch-records-by-filter');
var gatherDisplayFieldsForRecordType = require('@mpieva/psydb-api-lib/src/gather-display-fields-for-record-type');
var fetchOneCustomRecordType = require('@mpieva/psydb-api-lib/src/fetch-one-custom-record-type');
var fetchRelatedLabelsForMany = require('@mpieva/psydb-api-lib/src/fetch-related-labels-for-many');

var selectableStudies = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    var {
        studyRecordType,
        experimentType,
    } = request.body

    var {
        displayFields,
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        db,
        collectionName: 'study',
        customRecordType: studyRecordType
    });

    var customRecordTypeData = await fetchOneCustomRecordType({
        db,
        collection: 'study',
        type: studyRecordType,
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
                    'state.runningPeriod.end': { $exists: false },
                }
            ]
        }},
    ];

    if (experimentType) {
        additionalPreprocessStages = [
            ...additionalPreprocessStages,
            ...({
                'online': [
                    { $match: {
                        'state.selectionSettingsBySubjectType.enableOnlineTesting': true,
                    }}
                ],
                'inhouse': [
                    { $match: {
                        'state.inhouseTestLocationSettings': { $not: { $size: 0 }}
                    }}
                ],
                'away-team': [
                    { $match: {
                        'state.selectionSettingsBySubjectType.externalLocationGrouping.enabled': true,
                    }}
                ]
            }[experimentType])
        ];
    }

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
