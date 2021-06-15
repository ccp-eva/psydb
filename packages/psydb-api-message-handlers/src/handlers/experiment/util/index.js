'use strict';
var debug = require('debug')('psydb:api:message-handlers');

module.exports = {
    checkIntervalHasReservation: (
        require('./check-interval-has-reservation')
    ),
    checkConflictingLocationReservations: (
        require('./check-conflicting-location-reservations')
    ),
    checkConflictingSubjectExperiments: (
        require('./check-conflicting-subject-experiments')
    ),

    dispatchCreateEvents: (
        require('./dispatch-create-events')
    ),
};
