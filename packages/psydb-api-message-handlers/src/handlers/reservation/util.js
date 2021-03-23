'use strict';
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var checkConflictingTeamReservations = async ({
    db,
    experimentOperatorTeamId,
    interval
}) => {
    var conflicting = await (
        db.collection('reservation')
        .find({
            'state.experimentOperatorTeamId': experimentOperatorTeamId,
            'state.interval.start': { $lte: interval.end },
            'state.interval.end': { $gt: interval.start }
        })
        .toArray()
    );

    if (conflicting.length > 0) {
        throw new ApiError(
            400, 'DuplicateExperimentOperatorTeamReservation'
        );
    }
}

var checkConflictingLocationReservations = async ({
    db,
    locationId,
    interval
}) => {
    var conflicting = await (
        db.collection('reservation')
        .find({
            'state.locationId': locationId,
            'state.interval.start': { $lte: interval.end },
            'state.interval.end': { $gt: interval.start }
        })
        .toArray()
    );

    if (conflicting.length > 0) {
        throw new ApiError(
            400, 'DuplicateLocationReservation'
        );
    }
}

module.exports = {
    checkConflictingTeamReservations,
    checkConflictingLocationReservations,
};
