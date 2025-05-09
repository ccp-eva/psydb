'use strict';
var debug = require('debug')('psydb:api:message-handler-lib');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var verifyNoConflictingLocationExperiments = async ({
    db,
    locationId,
    interval
}) => {
    var conflicting = await (
        db.collection('experiment')
        .find({
            'state.isCanceled': false,
            'state.locationId': locationId,
            // we are switching to half open intervals
            // i.e. ends are set on .000Z
            // therefor $lt is the way to go
            'state.interval.start': { $lt: interval.end },
            'state.interval.end': { $gt: interval.start }
        })
        .toArray()
    );

    if (conflicting.length > 0) {
        throw new ApiError(409, {
            apiStatus: 'ConflictingLocationExperiment',
            data: conflicting
        });
    }
}

module.exports = verifyNoConflictingLocationExperiments;
