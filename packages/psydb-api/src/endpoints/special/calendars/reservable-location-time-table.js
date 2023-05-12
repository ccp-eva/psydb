'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:reservableLocationTimetable'
);

var {
    ResponseBody,
    validateOrThrow,
    verifyLabOperationAccess,
    fetchRecordsInInterval,
} = require('@mpieva/psydb-api-lib');

var {
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var {
    ExactObject,
    ForeignId,
    DateTime,
    DefaultBool
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        locationId: ForeignId({ collection: 'location' }),
        start: DateTime(),
        end: DateTime(),
    },
    required: [
        'locationId',
        'start',
        'end',
    ]
})

var reservableLocationTimeTable = async (context, next) => {
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
        locationId,
        start,
        end,
    } = request.body;

    verifyLabOperationAccess({
        labOperationTypes: [ 'inhouse', 'online-video-call' ],
        flags: [
            'canWriteReservations',
            'canSelectSubjectsForExperiments',
            'canMoveAndCancelExperiments'
        ],
        permissions,
        
        matchTypes: 'some',
        matchFlags: 'some',
    });
    
    var reservationRecords = await fetchRecordsInInterval({
        db, collection: 'reservation',
        start, end,
        additionalStages: [
            { $match: {
                type: 'inhouse',
                'state.locationId': locationId,
            }}
        ]
    });
    
    var experimentRecords = await fetchRecordsInInterval({
        db, collection: 'experiment',
        start, end,
        additionalStages: [
            { $match: {
                type: { $in: [ 'inhouse', 'online-video-call' ] },
                'state.locationId': locationId,
                'state.isCanceled': false,
            }}
        ]
    });
   
    var studyIds = [
        ...reservationRecords.map(it => it.state.studyId),
        ...experimentRecords.map(it => it.state.studyId),
    ]

    var studyRecords = await (
        db.collection('study').aggregate([
            { $match: {
                _id: { $in: studyIds },
            }},
            { $project: {
                'state.shorthand': true
            }}
        ]).toArray()
    )
    var labTeamRecords = await (
        db.collection('experimentOperatorTeam').aggregate([
            { $match: {
                studyId: { $in: studyIds },
            }},
            StripEventsStage(),
        ]).toArray()
    );


    var labSettingsRecords = await (
        db.collection('experimentVariantSetting').aggregate([
            { $match: {
                studyId: { $in: studyIds },
            }},
            StripEventsStage(),
        ]).toArray()
    )

    context.body = ResponseBody({
        data: {
            reservationRecords,
            experimentRecords,
            studyRecords,
            labTeamRecords,
            labSettingsRecords,
        }
    });

    await next();
}

module.exports = reservableLocationTimeTable;
