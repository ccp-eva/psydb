'use strict';
var endpoints_SPLIT = require('@mpieva/psydb-api-endpoints');
var endpoints = require('../../endpoints');
var { withPostStages, withGetStages } = require('./stage-helpers');

var addExperimentRoutes = (bag) => {
    var { router } = bag;

    router.post('/experiment/list-postprocessing', ...withPostStages({
        endpoint: endpoints_SPLIT.experiment.listPostprocessing,
    }));
}

module.exports = addExperimentRoutes;
