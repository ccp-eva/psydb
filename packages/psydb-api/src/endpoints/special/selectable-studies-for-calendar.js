'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:selectableStudiesForCalendar'
);

var {
    keyBy,
    compareIds
} = require('@mpieva/psydb-core-utils');

var {
    validateOrThrow,
    ApiError,
    ResponseBody
} = require('@mpieva/psydb-api-lib');

var {
    MatchIntervalAroundStage,
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

    // TODO: check params
    // TODO: check permissions

    var {
        experimentType,
        subjectRecordType,
        researchGroupId,
    } = request.body

    // FIXME: this should actually be the interval of the calendar
    var now = new Date();
    var stages = [
        MatchIntervalAroundStage({
            recordIntervalPath: 'state.runningPeriod',
            recordIntervalEndCanBeNull: true,
            start: now,
            end: now,
        }),
        /*{ $match: {
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
        }},*/
    ];

    if (researchGroupId) {
        stages.push({ $match: {
            'state.researchGroupIds': researchGroupId
        }})
    }

    var records = await (
        db.collection('study').aggregate([
            ...SystemPermissionStages({ permissions }),
            StripEventsStage(),
            ...stages,
        ]).toArray()
    );

    var settingRecords = await (
        db.collection('experimentVariantSetting').aggregate([
            { $match: {
                studyId: { $in: records.map(it => it._id) },
                type: experimentType,
            }},
            { $project: {
                studyId: true,
            }}
        ]).toArray()
    );

    records = records.filter(study => (
        settingRecords.find(setting => (
            compareIds(study._id, setting.studyId))
        )
    ))

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
