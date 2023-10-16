'use strict';

var createCRTCollectionStages = require('./create-crt-collection-stages');
var createPermissionCheckStages = require('./create-permission-check-stages');

// FIXME: compat
var {
    isNotDummyStage,
    isNotRemovedStage,
    isNotHiddenStage
} = require('@mpieva/psydb-mongo-stages');

module.exports = {
    createCRTCollectionStages,
    createPermissionCheckStages,

    isNotDummyStage,
    isNotRemovedStage,
    isNotHiddenStage
}
