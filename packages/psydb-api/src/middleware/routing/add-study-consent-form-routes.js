'use strict';
var endpoints = require('@mpieva/psydb-api-endpoints');
var { withPostStages, withGetStages } = require('./stage-helpers');

var addStudyConsentFormRoutes = (bag) => {
    var { router } = bag;

    router.post('/study-consent-form/read', ...withPostStages({
        endpoint: endpoints.studyConsentForm.read
    }));
    router.post('/study-consent-form/list', ...withPostStages({
        endpoint: endpoints.studyConsentForm.list
    }));
}

module.exports = addStudyConsentFormRoutes;
