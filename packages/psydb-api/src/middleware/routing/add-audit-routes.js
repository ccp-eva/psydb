'use strict';
var endpoints_SPLIT = require('@mpieva/psydb-api-endpoints');
var endpoints = require('../../endpoints/');
var { withPostStages, withGetStages } = require('./stage-helpers');

var addAuditRoutes = (bag) => {
    var { router } = bag;

    router.post('/audit/mq-message-history/list', ...withPostStages({
        endpoint: endpoints.audit.mqMessageHistory.list
    }));
    router.post('/audit/mq-message-history/read', ...withPostStages({
        endpoint: endpoints.audit.mqMessageHistory.read
    }));
    router.post('/audit/rohrpost-event/list', ...withPostStages({
        endpoint: endpoints.audit.rohrpostEvent.list
    }));
    router.post('/audit/rohrpost-event/read', ...withPostStages({
        endpoint: endpoints.audit.rohrpostEvent.read
    }));

}

module.exports = addAuditRoutes;
