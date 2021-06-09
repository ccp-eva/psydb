'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:selectableStudiesForCalendar'
);

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv'),
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body'),
    keyBy = require('@mpieva/psydb-common-lib/src/key-by');

var {
    StripEventsStage,
    SystemPermissionStages,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var fetchCustomRecordTypes = require('@mpieva/psydb-api-lib/src/fetch-custom-record-types');
var createRecordLabel = require('@mpieva/psydb-api-lib/src/create-record-label');

var selectableStudiesForCalendar = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    var {
        experimentType,
        subjectRecordType,
        researchGroupId,
    } = request.body

    var now = new Date();
    var stages = [
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
            ],
            ...(researchGroupId && {
                'state.researchGroupIds': researchGroupId
            })
        }},
    ];

    if (experimentType) {
        stages = [
            ...stages,
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

    var records = await (
        db.collection('study').aggregate([
            ...SystemPermissionStages({ permissions }),
            StripEventsStage(),
            ...stages,
        ]).toArray()
    );

    var studyRecordTypeKeys = {};
    for (var it of records) {
        studyRecordTypeKeys[it.type] = true;
    }

    var studyRecordTypes = await fetchCustomRecordTypes({
        db,
        collection: 'study',
        additionalStages: [
            { $match: {
                type: { $in: Object.keys(studyRecordTypeKeys) }
            }}
        ]
    });
    
    var studyRecordTypesByTypeKey = keyBy({
        items: studyRecordTypes,
        byProp: 'type'
    });

    var redactedRecords = [];
    for (var it of records) {
        redactedRecords.push({
            _id: it._id,
            _recordLabel: createRecordLabel({
                record: it,
                definition: (
                    studyRecordTypesByTypeKey[it.type]
                    .state.recordLabelDefinition
                )
            })
        })
    }

    context.body = ResponseBody({
        data: {
            records: redactedRecords,
        },
    });


    await next();
}

module.exports = selectableStudiesForCalendar;
