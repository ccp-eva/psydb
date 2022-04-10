'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
    checkIntervalHasReservation
} = require('@mpieva/psydb-api-lib');

// FIXME: since we disconnected experiments from reservation kinda
// we need to check if there are conflicting experiment in add addition
// to this i think
var verifyIntervalHasReservation = async ({
    db,
    interval,
    locationId,
    experimentOperatorTeamId
}) => {
    var hasReservation = await checkIntervalHasReservation({
        db,
        interval,
        locationId,
        experimentOperatorTeamId
    });

    if (!hasReservation) {
        throw new ApiError(400, 'ReservationConflict');
    }
}

module.exports = verifyIntervalHasReservation;
