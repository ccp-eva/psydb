'use strict';
// TODO
// var {
//     verifySubjectMovable
// }= require('@mpieva/psydb-common-verify-helpers')

var {
    ApiError,
    compareIds
} = require('@mpieva/psydb-api-lib');

var verifySubjectMovableToExperiment = (
    require('./verify-subject-movable-to-experiment')
)

var verifySubjectMovableToReservation = (
    require('./verify-subject-movable-to-reservation')
)

var verifySubjectMovable = async (context, options) => {
    var { db } = context;
    var {
        subjectId,
        sourceExperimentRecord,
        targetExperimentRecord,
        targetReservationData
    } = options;

    if (targetExperimentRecord) {
        await verifySubjectMovableToExperiment(context, options);
    }
    else if (targetReservationData) {
        await verifySubjectMovableToReservation(context, options);
    }
    else {
        throw new Error(
            'either provide targetExperimentRecord or targetReservationData'
        );
    }

}


module.exports = verifySubjectMovable;
