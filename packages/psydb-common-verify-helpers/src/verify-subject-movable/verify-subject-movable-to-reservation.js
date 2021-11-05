'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');

var checkSubjectInExperiment = require('../check-subject-in-experiment');
var verifySourceExperiment = require('./verify-source-experiment');

// TODO
/*var checkIntervalHasReservation = (
    require('../check-interval-has-reservation')
);
var checkConflictingSubjectExperiments = (
    require('../check-conflicting-subject-experiments')
);*/

var verifySubjectMovableToReservation = async (options) => {
    var {
        subjectId,
        sourceExperimentRecord,
        targetReservationData,

        existingExperimentRecords,
        existingReservationRecords,
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

    /*await checkIntervalHasReservation({
        db,
        interval,
        locationId: locationRecord._id,
        experimentOperatorTeamId: opsTeamRecord._id,
    });

    await checkConflictingSubjectExperiments({
        db, subjectIds: [ subjectId ], interval
    });*/
};

module.exports = verifySubjectMovableToReservation;

