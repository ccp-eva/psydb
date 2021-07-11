'use strict';
var debug = require('debug')('psydb:api:message-handlers');

module.exports = {
    checkIntervalHasReservation: (
        require('./check-interval-has-reservation')
    ),
    checkConflictingLocationReservations: (
        require('./check-conflicting-location-reservations')
    ),
    checkConflictingLocationExperiments: (
        require('./check-conflicting-location-experiments')
    ),
    checkConflictingSubjectExperiments: (
        require('./check-conflicting-subject-experiments')
    ),

    dispatchCreateEvents: (
        require('./dispatch-create-events')
    ),
    dispatchAddSubjectEvents: (
        require('./dispatch-add-subject-events')
    ),
    dispatchRemoveSubjectEvents: (
        require('./dispatch-remove-subject-events')
    ),
};
