'use strict';
var endpoints = require('@mpieva/psydb-api-endpoints');
var { withPostStages, withGetStages } = require('./stage-helpers');

var addStudyConsentDocRoutes = (bag) => {
    var { router } = bag;

    //router.post('/study-consent-doc/read', ...withPostStages({
    //    endpoint: endpoints.studyConsentDoc.read
    //}));
    router.post('/study-consent-doc/list', ...withPostStages({
        endpoint: endpoints.studyConsentDoc.list
    }));
}

module.exports = addStudyConsentDocRoutes;
