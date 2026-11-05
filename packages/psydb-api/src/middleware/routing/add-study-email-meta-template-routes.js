'use strict';
var endpoints = require('@mpieva/psydb-api-endpoints');
var { withPostStages } = require('./stage-helpers');

var addStudyEmailMetaTemplateRoutes = (bag) => {
    var { router } = bag;

    router.post('/study-email-meta-template/read', ...withPostStages({
        endpoint: endpoints.studyEmailMetaTemplate.read
    }));
    router.post('/study-email-meta-template/list', ...withPostStages({
        endpoint: endpoints.studyEmailMetaTemplate.list
    }));
}

module.exports = addStudyEmailMetaTemplateRoutes;
