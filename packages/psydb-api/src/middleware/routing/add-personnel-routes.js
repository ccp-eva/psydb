'use strict';
var endpoints_SPLIT = require('@mpieva/psydb-api-endpoints');
var endpoints = require('../../endpoints');
var { withPostStages, withGetStages } = require('./stage-helpers');

var addPersonnelRoutes = (bag) => {
    var { router } = bag;

    router.post('/personnel/related-participation', ...withPostStages({
        endpoint: endpoints.personnel.relatedParticipation
    }));
    
    router.post('/personnel/list', ...withPostStages({
        endpoint: endpoints_SPLIT.personnel.list,
    }));
    router.post('/personnel/read-many-labels', ...withPostStages({
        endpoint: endpoints_SPLIT.personnel.readManyLabels,
    }));
}

module.exports = addPersonnelRoutes;
