'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:reservationCalendar'
);

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');
var compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');
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
        locationRecordType: IdentifierString(),
        start: DateTime(),
        end: DateTime(),
    },
    required: [
        'studyId',
        'locationRecordType',
        'start',
        'end'
    ]
})

var studyLocationReservationCalendar = async (context, next) => {
    var { 
        db,
        permissions,
        params,
    } = context;

    var ajv = Ajv();
    var isValid = ajv.validate(ParamsSchema(), params);
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, 'InvalidParams');
    }

    var {
        studyId,
        locationRecordType: locationType,
        start,
        end
    } = params;

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

    var locationRecords = await fetchEnabledLocationRecordsForStudy({
        db, studyId, locationType
    });

    var reservationRecords = await fetchRecordsInInterval({
        db,
        collection: 'reservation',
        start,
        end,
        additionalStages: [
            { $match: { type: { $in: [ 'inhouse', 'online-video-call' ] }}}
        ]
    });

    reservationRecords = stripIfOtherStudy({
        records: reservationRecords,
        studyId,
    });

    var experimentRecords = await fetchRecordsInInterval({
        db,
        collection: 'experiment',
        start,
        end,
        additionalStages: [
            { $match: {
                type: { $in: [ 'inhouse', 'online-video-call' ] },
                'state.isCanceled': false,
            }}
        ]
    });
    
    experimentRecords = stripIfOtherStudy({
        records: experimentRecords,
        studyId,
    });

    context.body = ResponseBody({
        data: {
            locationRecords,
            reservationRecords,
            experimentRecords,
        }
    });

    await next();
}

var stripIfOtherStudy = ({
    records,
    studyId,
}) => (
    records.map(
        ({ _id, state, ...other }) => (
            compareIds(state.studyId, studyId)
            ? { _id, state, ...other }
            : {
                _id,
                state: { interval: state.interval },
                ...other
            }
        )
    )
);

module.exports = studyLocationReservationCalendar;

