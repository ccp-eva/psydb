'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:awayTeamCalendar'
);

var {
    compareIds,
} = require('@mpieva/psydb-core-utils');

var {
    checkLabOperationAccess,
} = require('@mpieva/psydb-common-lib');

var {
    ApiError,
    ResponseBody,
    validateOrThrow,

    createRecordLabel,
    fetchRecordById,
    fetchRecordsInInterval,
} = require('@mpieva/psydb-api-lib');

var {
    ExactObject,
    Id,
    IdentifierString,
    DateTime,
} = require('@mpieva/psydb-schema-fields');

var RequestParamsSchema = () => ExactObject({
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
        schema: RequestParamsSchema(),
        payload: params
    });

    var {
        studyId,
        start,
        end
    } = params;

    var studyRecord = await (
        db.collection('study').findOne({
            _id: studyId,
        }, { projection: { 'state.researchGroupIds': true }})
    );

    // FIXME: make this into utility
    var hasAnyAccess = false;
    for (var researchGroupId of studyRecord.state.researchGroupIds) {
        var currentAllowed = checkLabOperationAccess({
            permissions,
            researchGroupId,
            labOperationType: 'away-team',
            flags: [
                'canWriteReservations',
                'canSelectSubjectsForExperiments',
                'canMoveAndCancelExperiments'
            ],
            checkJoin: 'or',
        });
        if (currentAllowed) {
            hasAnyAccess = true;
            break;
        }
    }
    if (!hasAnyAccess) {
        throw new ApiError(403, {
            apiStatus: 'LabOperationAccessDenied',
            data: {
                researchGroupIds: studyRecord.state.researchGroupIds,
                flags: [
                    'canWriteReservations',
                    'canSelectSubjectsForExperiments',
                    'canMoveAndCancelExperiments'
                ],
                checkJoin: 'or',
            }
        })
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

