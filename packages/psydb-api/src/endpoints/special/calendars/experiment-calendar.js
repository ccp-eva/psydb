'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:inhouseExperimentCalendar'
);

var datefns = require('date-fns');
var enums = require('@mpieva/psydb-schema-enums');

var {
    keyBy,
    groupBy,
    compareIds,
} = require('@mpieva/psydb-core-utils');

var {
    ApiError,
    ResponseBody,
    
    validateOrThrow,
    verifyLabOperationAccess,

    convertPointerToPath,
    fetchOneCustomRecordType,
    gatherDisplayFieldsForRecordType,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var {
    MatchIntervalAroundStage,
    MatchIntervalOverlapStage,
    StripEventsStage,
    ProjectDisplayFieldsStage,
    SystemPermissionStages,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var {
    ExactObject,
    ForeignId,
    ForeignIdList,
    DefaultBool,
    CustomRecordTypeKey,
    DateTimeInterval,
    ExperimentTypeEnum,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        //researchGroupId: ForeignId({ collection: 'researchGroup' }),
        subjectRecordType: CustomRecordTypeKey({ collection: 'subject' }),
        interval: DateTimeInterval(),
        studyId: ForeignId({ collection: 'study' }),
        experimentType: ExperimentTypeEnum(),
        researchGroupId: ForeignId({
            collection: 'researchGroup',
        }),

        experimentOperatorTeamIds: ForeignIdList({
            collection: 'experimentOperatorTeam'
        }),
        showPast: DefaultBool(),
    },
    required: [
        'researchGroupId',
        'subjectRecordType',
        'interval',
        'experimentType',
    ]
})

var experimentCalendar = async (context, next) => {
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
        subjectRecordType,
        interval,
        studyId,
        experimentType,
        researchGroupId,

        experimentOperatorTeamIds,
        showPast,
    } = request.body;

    if (!permissions.isRoot()) {
        showPast = false;
    }

    var { start, end } = interval;

    verifyLabOperationAccess({
        researchGroupId,
        labOperationType: experimentType,
        flag: 'canViewExperimentCalendar',
        permissions,
    });

    var studyRecords = []
    if (studyId) {
        studyRecords = await (
            db.collection('study').aggregate([
                { $match: {
                    _id: studyId,
                }},
                { $project: {
                    'state.shorthand': true
                }},
                { $sort: {
                    'state.shorthand': 1
                }}
            ], {
                collation: { locale: 'de@collation=phonebook' }
            })
            .toArray()
        );
    }
    else {
        studyRecords = await (
            db.collection('study').aggregate([
                MatchIntervalAroundStage({
                    recordIntervalPath: 'state.runningPeriod',
                    recordIntervalEndCanBeNull: true,
                    start,
                    end,
                }),
                { $match: {
                    'state.researchGroupIds': researchGroupId
                }},
            ]).toArray()
        );
    }

    var studyIds = studyRecords.map(it => it._id);
    
    var studiesById = keyBy({
        items: studyRecords,
        byProp: '_id'
    });

    console.log(experimentOperatorTeamIds);
    var now = new Date();
    var experimentRecords = await (
        db.collection('experiment').aggregate([
            MatchIntervalOverlapStage({ start, end }),
            { $match: {
                type: experimentType,
                'state.studyId': { $in: studyIds },
                'state.isCanceled': false,

                ...(experimentOperatorTeamIds && {
                    'state.experimentOperatorTeamId': { $in: experimentOperatorTeamIds }
                }),
                ...(!showPast && {
                    'state.interval.start': { $gte: datefns.startOfDay(now) }
                })
            }},
            StripEventsStage(),
            { $sort: { 'state.interval.start': 1 }}
        ]).toArray()
    );

    var subjectIds = [];
    for (var it of experimentRecords) {
        subjectIds = [
            ...subjectIds,
            ...(
                it.state.subjectData
                .filter(it => (
                    !enums.unparticipationStatus.keys.includes(
                        it.participationStatus
                    )
                ))
                .map(it => it.subjectId)
            )
        ]
    }

    //console.log(subjectIds);

    var subjectRecordTypeData = await fetchOneCustomRecordType({
        db,
        collection: 'subject',
        type: subjectRecordType,
    });

    var {
        displayFields,
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        prefetched: subjectRecordTypeData,
    });

    // TODO: theese fields needs a flag of some kind so that they are allowed
    // to be shown here
    // find the first PhoneWithTypeList field
    var phoneListField = (
        subjectRecordTypeData.state.settings.subChannelFields.gdpr
        .find(field => {
            return (field.type === 'PhoneWithTypeList');
        })
    );

    var subjectRecords = await (
        db.collection('subject').aggregate([
            { $match: {
                _id: { $in: subjectIds }
            }},
            StripEventsStage({ subChannels: ['gdpr', 'scientific' ]}),

            ProjectDisplayFieldsStage({
                displayFields,
                additionalProjection: {
                    type: true,
                }
            }),
        ]).toArray()
    );

    var subjectRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'subject',
        recordType: subjectRecordType,
        records: subjectRecords
    })

    var experimentRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'experiment',
        records: experimentRecords
    })

    //console.dir(subjectRelated, { depth: null });

    //console.log(experimentRecords);

    var experimentOperatorTeamRecords = await (
        db.collection('experimentOperatorTeam').aggregate([
            { $match: {
                studyId: { $in: studyRecords.map(it => it._id) }
            }},
            //{ $match: {
            //    _id: { $in: experimentRecords.map(it => (
            //        it.state.experimentOperatorTeamId
            //    ))},
            //}},
            StripEventsStage(),
        ]).toArray()
    );

    var subjectRecordsById = keyBy({
        items: subjectRecords,
        byProp: '_id'
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
            studyRecords,
            experimentRecords: experimentRecords.map(it => ({
                ...it,
                _canFollowUp: studiesById[it.state.studyId].state.enableFollowUpExperiments
            })),
            experimentOperatorTeamRecords,
            experimentRelated,
            subjectRecordsById,
            subjectRelated,
            subjectDisplayFieldData: displayFieldData,
            phoneListField,
        },
    });

    await next();
}


module.exports = experimentCalendar;
