'use strict';
var endpoints_SPLIT = require('@mpieva/psydb-api-endpoints');
var endpoints = require('../../endpoints/');
var { withPostStages, withGetStages } = require('./stage-helpers');

var addStudyRoutes = (bag) => {
    var { router } = bag;

    router.post('/study/read', ...withPostStages({
        endpoint: endpoints.study.read
    }));
    router.post('/study/read-many', ...withPostStages({
        endpoint: endpoints.study.readMany
    }));
    router.post('/study/subject-type-infos', ...withPostStages({
        endpoint: endpoints.study.subjectTypeInfos
    }));
    router.post('/study/available-subject-crts', ...withPostStages({
        endpoint: endpoints.study.availableSubjectCRTs
    }));
    router.post('/study/enabled-subject-crts', ...withPostStages({
        endpoint: endpoints.study.enabledSubjectCRTs
    }));
    router.post('/study/enabled-csv-importers', ...withPostStages({
        endpoint: endpoints.study.enabledCSVImporters
    }));
    
    router.post('/study/list', ...withPostStages({
        endpoint: endpoints_SPLIT.study.list,
        enableApiKeyAuth: true,
    }));
}

module.exports = addStudyRoutes;
