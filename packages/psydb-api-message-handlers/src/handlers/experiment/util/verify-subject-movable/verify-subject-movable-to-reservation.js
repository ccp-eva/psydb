'use strict';
var {
    ApiError,
    compareIds
} = require('@mpieva/psydb-api-lib');

var checkSubjectInExperiment = require('./check-subject-in-experiment');
var verifySourceExperiment = require('./verify-source-experiment');

var checkIntervalHasReservation = (
    require('../check-interval-has-reservation')
);
var checkConflictingSubjectExperiments = (
    require('../check-conflicting-subject-experiments')
);

var verifySubjectMovableToReservation = async (context, options) => {
    var { db } = context;
    var {
        subjectId,
        sourceExperimentRecord,
        targetReservationData
    } = options;
    
    var {
        type: sourceType,
        state: sourceState,
    } = sourceExperimentRecord;
    
    var {
        locationRecord,
        opsTeamRecord,
        interval,
    } = targetReservationData;

    verifySourceExperiment(options);

    await checkIntervalHasReservation({
        db,
        interval,
        locationId: locationRecord._id,
        experimentOperatorTeamId: opsTeamRecord._id,
    });

    await checkConflictingSubjectExperiments({
        db, subjectIds: [ subjectId ], interval
    });
};

module.exports = verifySubjectMovableToReservation;

