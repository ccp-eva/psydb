'use strict';

module.exports = {
    verifyNoConflictingLocationExperiments: (
        require('./verify-no-conflicting-location-experiments')
    ),
    noop: require('./noop'),

    ...require('./verify-one-record'),
    ...require('./verify-one-crt'),
};
