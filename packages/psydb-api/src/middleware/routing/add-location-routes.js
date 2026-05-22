'use strict';
var endpoints_SPLIT = require('@mpieva/psydb-api-endpoints');
var endpoints = require('../../endpoints');
var { withPostStages, withGetStages } = require('./stage-helpers');

var addLocationRoutes = (bag) => {
    var { router } = bag;

    //router.get('/location-reverse-refs/:id', ...withGetStages({
    //    endpoint: endpoints.special.locationReverseRefs
    //}));

    //router.post('/location-experiment-calendar', ...withPostStages({
    //    endpoint: endpoints.special.locationExperimentCalendar
    //}));
    //
    //router.post('/location/related-experiments', ...withPostStages({
    //    endpoint: endpoints.location.relatedExperiments
    //}));

    
    router.post('/location/extended-search', ...withPostStages({
        endpoint: endpoints_SPLIT.location.extendedSearch,
    }));
}

module.exports = addLocationRoutes;
