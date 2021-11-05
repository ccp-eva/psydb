'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');

var verifySubjectMovableToExperiment = (
    require('./verify-subject-movable-to-experiment')
)

var verifySubjectMovableToReservation = (
    require('./verify-subject-movable-to-reservation')
)

var verifySubjectMovable = (options) => {
    var {
        subjectId,
        sourceExperimentRecord,
        targetExperimentRecord,
        targetReservationData
    } = options;

    if (targetExperimentRecord) {
        verifySubjectMovableToExperiment(options);
    }
    else if (targetReservationData) {
        verifySubjectMovableToReservation(options);
    }
    else {
        throw new Error(
            'either provide targetExperimentRecord or targetReservationData'
        );
    }

}


module.exports = verifySubjectMovable;
