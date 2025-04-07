'use strict';
var endpoints_SPLIT = require('@mpieva/psydb-api-endpoints');
var endpoints = require('../../endpoints/');
var { withPostStages, withGetStages } = require('./stage-helpers');

var addSubjectRoutes = (bag) => {
    var { router } = bag;

    router.post('/subject/possible-test-intervals', ...withPostStages({
        endpoint: endpoints.special.readSubjectTestability,
        enableApiKeyAuth: false,
    }));

    
    router.post('/subject/related-experiments', ...withPostStages({
        endpoint: endpoints_SPLIT.subject.relatedExperiments,
        enableApiKeyAuth: false,
    }));
    router.post('/subject/read-many', ...withPostStages({
        endpoint: endpoints_SPLIT.subject.readMany,
        enableApiKeyAuth: false,
    })); 
    router.post('/subject/read-for-invite-mail', ...withPostStages({
        endpoint: endpoints_SPLIT.subject.readForInviteMail,
        enableApiKeyAuth: false,
    }));
    

    router.post('/subject/read', ...withPostStages({
        endpoint: endpoints_SPLIT.subject.read,
        enableApiKeyAuth: false,
    }));
    router.post('/subject/read-spooled', ...withPostStages({
        endpoint: endpoints_SPLIT.subject.readSpooled,
        enableApiKeyAuth: false,
    }));
    
    router.post('/subject/listDuplicates', ...withPostStages({
        endpoint: endpoints_SPLIT.subject.listDuplicates,
        enableApiKeyAuth: false,
    }));
}

module.exports = addSubjectRoutes;
