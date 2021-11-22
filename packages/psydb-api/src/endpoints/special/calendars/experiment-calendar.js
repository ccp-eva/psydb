'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:inhouseExperimentCalendar'
);

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
    },
    required: [
        //'researchGroupId',
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
    } = request.body;

    var { start, end } = interval;

    verifyLabOperationFlag({
        researchGroupId,
        labOperationType: experimentType,
        flag: 'canViewExperimentCalendar',
        permissions,
    });

    var studyRecords = []
    if (studyId) {
        studyRecords = await (
            db.collection('study').find({
                _id: studyId,
            }).toArray()
        );
    }
    else {
        studyRecords = await (
            db.collection('study').aggregate([
                ...SystemPermissionStages({
                    collection: 'study',
                    permissions
                }),
                MatchIntervalAroundStage({
                    recordIntervalPath: 'state.runningPeriod',
                    recordIntervalEndCanBeNull: true,
                    start,
                    end,
                }),
                /*{ $match: {
                    $or: [
                        {
                            'state.runningPeriod.start': { $lte: start },
                            'state.runningPeriod.end': { $gte: start }
                        },
                        {
                            'state.runningPeriod.start': { $lte: end },
                            'state.runningPeriod.end': { $gte: end },
                        },
                        {
                            'state.runningPeriod.start': { $lte: end },
                            $or: [
                                {
                                    'state.runningPeriod.end': { $exists: false },
                                },
                                {
                                    'state.runningPeriod.end': { $type: 10 },
                                },
                            ]
                        }
                    ],
                    ...(researchGroupId && {
                        'state.researchGroupIds': researchGroupId
                    })
                }},*/
            ]).toArray()
        );
    }

    var studyIds = studyRecords.map(it => it._id);
    var experimentRecords = await (
        db.collection('experiment').aggregate([
            MatchIntervalOverlapStage({ start, end }),
            { $match: {
                type: experimentType,
                'state.studyId': { $in: studyIds },
                'state.isCanceled': false,
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
    // find the first PhoneList field
    var phoneListField = (
        subjectRecordTypeData.state.settings.subChannelFields.gdpr
        .find(field => {
            return (field.type === 'PhoneList');
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
                _id: { $in: experimentRecords.map(it => (
                    it.state.experimentOperatorTeamId
                ))},
            }},
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
            experimentRecords,
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
