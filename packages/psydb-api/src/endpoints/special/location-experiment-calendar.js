'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:locationExperimentCalendar'
);

var Ajv = require('@mpieva/psydb-api-lib/src/ajv'),
    ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var enums = require('@mpieva/psydb-schema-enums');

var groupBy = require('@mpieva/psydb-common-lib/src/group-by');
var keyBy = require('@mpieva/psydb-common-lib/src/key-by');
var compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');
var convertPointerToPath = require('@mpieva/psydb-api-lib/src/convert-pointer-to-path');

var fetchOneCustomRecordType = require('@mpieva/psydb-api-lib/src/fetch-one-custom-record-type');
var gatherDisplayFieldsForRecordType = require('@mpieva/psydb-api-lib/src/gather-display-fields-for-record-type');

var fetchRelatedLabelsForMany = require('@mpieva/psydb-api-lib/src/fetch-related-labels-for-many');

var {
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
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        locationType: CustomRecordTypeKey({ collection: 'location' }),
        researchGroupId: ForeignId({ collection: 'researchGroup' }),
        interval: DateTimeInterval(),
        
        studyId: ForeignId({ collection: 'study' }),
        experimentType: {
            type: 'string',
            enum: ['inhouse', 'away-team'],
        },
    },
    required: [
        'locationType',
        'researchGroupId',
        'interval',
    ]
})

var locationExperimentCalendar = async (context, next) => {
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
        throw new ApiError(400, 'InvalidRequestSchema');
    };


    var {
        locationType,
        researchGroupId,
        interval,

        studyId,
        experimentType,
    } = request.body;

    var { start, end } = interval;

    if (!permissions.hasRootAccess) {
        var allowed = permissions.allowedResearchGroupIds.find(id => {
            return compareIds(id, researchGroupId)
        })
        if (!allowed) {
            throw new ApiError(403)
        }
    }

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
                ...SystemPermissionStages({ permissions }),
                { $match: {
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
                            'state.runningPeriod.end': { $exists: false },
                        }
                    ],
                    ...(researchGroupId && {
                        'state.researchGroupIds': researchGroupId
                    })
                }},
            ]).toArray()
        );
    }

    var studyIds = studyRecords.map(it => it._id);

    var experimentRecords = await (
        db.collection('experiment').aggregate([
            MatchIntervalOverlapStage({ start, end }),
            { $match: {
                ...(experimentType && {
                     type: experimentType,
                }),
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
                _id: { $in: locationIds }
            }},
            StripEventsStage(),

            ProjectDisplayFieldsStage({
                displayFields,
                additionalProjection: {
                    'type': true,
                }
            }),
        ]).toArray()
    );

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
                _id: { $in: experimentRecords.map(it => (
                    it.state.experimentOperatorTeamId
                ))},
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
        },
    });

    await next();
}


module.exports = locationExperimentCalendar;
