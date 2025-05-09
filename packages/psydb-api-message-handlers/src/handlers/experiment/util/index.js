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

    verifySubjectMovable: (
        require('./verify-subject-movable')
    ),



    prepareSubjectRecord: (
        require('./prepare-subject-record')
    ),

    prepareLocationRecord: (
        require('./prepare-location-record')
    ),

    prepareExperimentRecord: (
        require('./prepare-experiment-record')
    ),

    prepareOpsTeamRecord: (
        require('./prepare-ops-team-record')
    ),

    prepareLabProcedureSettingRecords: (
        require('./prepare-lab-procedure-setting-records')
    ),



    prepareTargetLocation: (
        require('./prepare-target-location')
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
    
    resetSubjectInviteStatus: (
        require('./reset-subject-invite-status')
    ),
};
