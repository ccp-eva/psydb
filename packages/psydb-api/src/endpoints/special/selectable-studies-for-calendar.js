'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:selectableStudiesForCalendar'
);

var {
    keyBy,
    compareIds
} = require('@mpieva/psydb-core-utils');

var {
    ApiError,
    ResponseBody,

    validateOrThrow,
    verifyLabOperationAccess,

    fetchCustomRecordTypes,
    createRecordLabel,
} = require('@mpieva/psydb-api-lib');

var {
    MatchIntervalAroundStage,
    StripEventsStage,
    SystemPermissionStages,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var {
    ExactObject,
    DefaultArray,
    ForeignId,
    CustomRecordTypeKey,
    ExperimentTypeEnum,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        researchGroupId: ForeignId({ collection: 'researchGroup' }),
        experimentTypes: DefaultArray({
            items: ExperimentTypeEnum(),
            minLength: 1,
        }),
    },
    required: [
        //'researchGroupId',
        'experimentTypes',
    ]
});

var selectableStudiesForCalendar = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    })

    var {
        experimentTypes,
        researchGroupId = undefined,
    } = request.body

    verifyLabOperationAccess({
        researchGroupId,
        labOperationTypes: experimentTypes,
        flag: 'canViewExperimentCalendar',
        permissions,

        matchTypes: 'some',
        matchFlags: 'every',
    });

    var allowedExperimentTypes = permissions.getAllowedLabOpsForFlags({
        onlyTypes: experimentTypes,
        flags: [ 'canViewExperimentCalendar' ],
        researchGroupId
    });

    // FIXME: this should actually be the interval of the calendar
    var now = new Date();
    var stages = [
        { $match: {
            'state.internals.isRemoved': { $ne: true }
        }},
        MatchIntervalAroundStage({
            recordIntervalPath: 'state.runningPeriod',
            recordIntervalEndCanBeNull: true,
            start: now,
            end: now,
        }),
        ...(researchGroupId ? [{ $match: {
            'state.researchGroupIds': researchGroupId
        }}] : []),
        { $sort: {
            'state.shorthand': 1,
            'state.name': 1
        }},
    ];

    var records = await (
        db.collection('study').aggregate([
            StripEventsStage(),
            ...stages,
        ], { collation: { locale: 'de@collation=phonebook' }}).toArray()
    );

    var settingRecords = await (
        db.collection('experimentVariantSetting').aggregate([
            { $match: {
                studyId: { $in: records.map(it => it._id) },
                type: { $in: allowedExperimentTypes },
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
