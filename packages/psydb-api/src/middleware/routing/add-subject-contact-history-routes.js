'use strict';
var endpoints = require('@mpieva/psydb-api-endpoints');
var { withPostStages, withGetStages } = require('./stage-helpers');

var addSubjectContactHistoryRoutes = (bag) => {
    var { router } = bag;

    router.post('/subject-contact-history/list', ...withPostStages({
        endpoint: endpoints.subjectContactHistory.list
    }));
}

module.exports = addSubjectContactHistoryRoutes;
