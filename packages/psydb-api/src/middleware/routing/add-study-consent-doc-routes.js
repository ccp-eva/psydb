'use strict';
var endpoints = require('@mpieva/psydb-api-endpoints');
var { withPostStages, withGetStages } = require('./stage-helpers');

var addStudyConsentDocRoutes = (bag) => {
    var { router } = bag;

    router.post('/study-consent-doc/read', ...withPostStages({
        endpoint: endpoints.studyConsentDoc.read
    }));
    router.post('/study-consent-doc/list', ...withPostStages({
        endpoint: endpoints.studyConsentDoc.list
    }));
    
    router.post(
        '/study-consent-doc/read-by-experiment-and-subject',
        ...withPostStages({
            endpoint: endpoints.studyConsentDoc.readByExperimentAndSubject
        })
    );
}

module.exports = addStudyConsentDocRoutes;
