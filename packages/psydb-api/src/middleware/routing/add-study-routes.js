'use strict';
var endpoints_SPLIT = require('@mpieva/psydb-api-endpoints');
var { withPostStages, withGetStages } = require('./stage-helpers');

var addStudyRoutes = (bag) => {
    var { router } = bag;

    router.post('/study/read', ...withPostStages({
        endpoint: endpoints_SPLIT.study.read
    }));
    router.post('/study/read-many', ...withPostStages({
        endpoint: endpoints_SPLIT.study.readMany
    }));
    router.post('/study/subject-type-infos', ...withPostStages({
        endpoint: endpoints_SPLIT.study.subjectTypeInfos
    }));
    router.post('/study/available-subject-crts', ...withPostStages({
        endpoint: endpoints_SPLIT.study.availableSubjectCRTs
    }));
    router.post('/study/enabled-subject-crts', ...withPostStages({
        endpoint: endpoints_SPLIT.study.enabledSubjectCRTs
    }));
    router.post('/study/enabled-csv-importers', ...withPostStages({
        endpoint: endpoints_SPLIT.study.enabledCSVImporters
    }));
    
    router.post('/study/list', ...withPostStages({
        endpoint: endpoints_SPLIT.study.list,
        enableApiKeyAuth: true,
    }));
    router.post('/study/read-many-labels', ...withPostStages({
        endpoint: endpoints_SPLIT.study.readManyLabels,
    }));
    router.post('/study/related-study-consent-forms', ...withPostStages({
        endpoint: endpoints_SPLIT.study.relatedStudyConsentForms,
    }));
}

module.exports = addStudyRoutes;
