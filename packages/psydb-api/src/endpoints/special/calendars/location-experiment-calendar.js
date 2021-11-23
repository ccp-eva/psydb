'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:locationExperimentCalendar'
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
    createRecordLabel,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var {
    MatchIntervalAroundStage,
    MatchIntervalOverlapStage,
    StripEventsStage,
    ProjectDisplayFieldsStage,
    SystemPermissionStages,
    SeperateRecordLabelDefinitionFieldsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var {
    ExactObject,
    ForeignId,
    CustomRecordTypeKey,
    DateTimeInterval,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        locationType: CustomRecordTypeKey({ collection: 'location' }),
        researchGroupId: ForeignId({ collection: 'researchGroup' }),
        interval: DateTimeInterval(),
        
        studyId: ForeignId({ collection: 'study' }),
        experimentType: {
            type: 'string',
            enum: ['inhouse', 'online-video-call', 'away-team'],
        },
    },
    required: [
        'locationType',
        'researchGroupId',
        'experimentType',
        'interval',
    ]
})

var locationExperimentCalendar = async (context, next) => {
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
        locationType,
        researchGroupId,
        interval,

        studyId,
        experimentType,
    } = request.body;

    var { start, end } = interval;

    verifyLabOperationAccess({
        permissions,
        researchGroupId,
        labOperationType: experimentType,
        flags: [
            'canViewExperimentCalendar',
            'canWriteReservations',
            'canSelectSubjectsForExperiments',
            'canMoveAndCancelExperiments'
        ],
        checkJoin: 'or',
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
                { $match: {
                    'state.researchGroupIds': researchGroupId
                }}
            ]).toArray()
        );
    }

    var studyIds = studyRecords.map(it => it._id);

    var experimentRecords = await (
        db.collection('experiment').aggregate([
            MatchIntervalOverlapStage({ start, end }),
            { $match: {
                'type': 'away-team',
                'state.studyId': { $in: studyIds },
                'state.isCanceled': false,
            }},
            StripEventsStage(),
            { $sort: { 'state.interval.start': 1 }}
        ]).toArray()
    );

    var reservationRecords = await (
        db.collection('reservation').aggregate([
            MatchIntervalOverlapStage({ start, end }),
            { $match: {
                'type': 'awayTeam',
                'state.studyId': { $in: studyIds },
            }},
            StripEventsStage(),
            { $sort: { 'state.interval.start': 1 }}
        ]).toArray()
    );

    var locationIds = [];
    for (var it of experimentRecords) {
        locationIds = [
            ...locationIds,
            it.state.locationId,
        ]
    }

    var locationTypeData = await fetchOneCustomRecordType({
        db,
        collection: 'location',
        type: locationType,
    });

    var {
        displayFields,
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        prefetched: locationTypeData,
    });

    var locationRecords = await (
        db.collection('location').aggregate([
            { $match: {
                _id: { $in: locationIds },
                type: locationType,
            }},
            StripEventsStage(),

            SeperateRecordLabelDefinitionFieldsStage({
                recordLabelDefinition: (
                    locationTypeData.state.recordLabelDefinition
                ),
            }),
            ProjectDisplayFieldsStage({
                displayFields,
                additionalProjection: {
                    'type': true,
                    '_recordLabelDefinitionFields': true,
                }
            }),
        ]).toArray()
    );

    locationRecords.forEach(it => {
        it._recordLabel = createRecordLabel({
            record: it._recordLabelDefinitionFields,
            definition: locationTypeData.state.recordLabelDefinition
        });
        delete it._recordLabelDefinitionFields;
    });

    // XXX: this is hacky
    if (locationRecords.length < 1) {
        experimentRecords = [];
        reservationRecords = [];
    }

    var locationRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'location',
        recordType: locationType,
        records: locationRecords
    })

    var experimentRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'experiment',
        records: experimentRecords
    })

    var reservationRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'reservation',
        recordType: 'awayTeam',
        records: reservationRecords
    })

    //console.dir(locationRelated, { depth: null });

    //console.log(experimentRecords);

    var experimentOperatorTeamRecords = await (
        db.collection('experimentOperatorTeam').aggregate([
            { $match: {
                _id: { $in: [
                    ...experimentRecords.map(it => (
                        it.state.experimentOperatorTeamId
                    )),
                    ...reservationRecords.map(it => (
                        it.state.experimentOperatorTeamId
                    ))
                ]},
            }},
            StripEventsStage(),
        ]).toArray()
    );

    var locationRecordsById = keyBy({
        items: locationRecords,
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

    // FIXME: is hacky
    var studyRecordLabelsById = {
        ...experimentRelated.relatedRecordLabels.study,
        ...reservationRelated.relatedRecordLabels.study,
    };
    var studyRecordLabels = Object.values(studyRecordLabelsById);

    context.body = ResponseBody({
        data: {
            experimentRecords,
            experimentRelated,

            reservationRecords,
            reservationRelated,

            experimentOperatorTeamRecords,

            locationRecordsById,
            locationRelated,
            locationDisplayFieldData: displayFieldData,

            studyRecordLabels,
        },
    });

    await next();
}


module.exports = locationExperimentCalendar;
