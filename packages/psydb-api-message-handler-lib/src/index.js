'use strict';

module.exports = {
    verifyNoConflictingLocationExperiments: (
        require('./verify-no-conflicting-location-experiments')
    ),
    noop: require('./noop'),

    composables: require('./composables'),
    ...require('./composables/verify-one-record'), // FIXME: compat
    ...require('./composables/verify-one-crt'), // FIXME: compat

    createSchemaDefauls: require('./create-schema-defaults'),
    prepareStateUpdate: require('./prepare-state-update'),
};
