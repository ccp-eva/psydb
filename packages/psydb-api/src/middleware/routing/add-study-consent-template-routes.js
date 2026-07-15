'use strict';
var endpoints = require('@mpieva/psydb-api-endpoints');
var { withPostStages, withGetStages } = require('./stage-helpers');

var addStudyConsentTemplateRoutes = (bag) => {
    var { router } = bag;

    router.post('/study-consent-template/read', ...withPostStages({
        endpoint: endpoints.studyConsentTemplate.read
    }));
    router.post('/study-consent-template/list', ...withPostStages({
        endpoint: endpoints.studyConsentTemplate.list
    }));
}

module.exports = addStudyConsentTemplateRoutes;
