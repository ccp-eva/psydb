'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:awayTeamCalendar'
);

var {
    compareIds,
} = require('@mpieva/psydb-core-utils');

var {
    validateOrThrow,
    ApiError,
    ResponseBody,
} = require('@mpieva/psydb-api-lib');

var createRecordLabel = require('@mpieva/psydb-api-lib/src/create-record-label');
var fetchRecordById = require('@mpieva/psydb-api-lib/src/fetch-record-by-id');
var fetchRecordsInInterval = require('@mpieva/psydb-api-lib/src/fetch-records-in-interval');
var fetchEnabledLocationRecordsForStudy = require('@mpieva/psydb-api-lib/src/fetch-enabled-location-records-for-study');


var {
    ExactObject,
    Id,
    IdentifierString,
    DateTime,
} = require('@mpieva/psydb-schema-fields');

var ParamsSchema = () => ExactObject({
    properties: {
        studyId: Id(),
        start: DateTime(),
        end: DateTime(),
    },
    required: [
        'studyId',
        'start',
        'end'
    ]
})

var studyAwayTeamReservationCalendar = async (context, next) => {
    var { 
        db,
        permissions,
        params,
    } = context;

    validateOrThrow({
        schema: ParamsSchema(),
        payload: params
    });

    var {
        studyId,
        start,
        end
    } = params;

    // TODO: permissions

    var studyRecord = await fetchRecordById({
        db,
        collectionName: 'study',
        id: studyId,
        permissions,
    });

    // FIXME: question is should we 404 or 403 when access is denied?
    // well 404 for now and treat it as if it wasnt found kinda
    if (!studyRecord) {
        throw new ApiError(404, 'NoAccessibleStudyRecordFound');
    }

    var reservationRecords = await fetchRecordsInInterval({
        db,
        collection: 'reservation',
        start,
        end,
        additionalStages: [
            { $match: {
                type: 'awayTeam',
                'state.studyId': studyId,
            }}
        ]
    });

    var experimentRecords = await fetchRecordsInInterval({
        db,
        collection: 'experiment',
        start,
        end,
        additionalStages: [
            { $match: {
                type: 'away-team',
                'state.studyId': studyId,
                'state.isCanceled': false,
            }}
        ]
    });
    
    context.body = ResponseBody({
        data: {
            reservationRecords,
            experimentRecords,
        }
    });

    await next();
}

module.exports = studyAwayTeamReservationCalendar;

