'use strict';
var endpoints_SPLIT = require('@mpieva/psydb-api-endpoints');
var endpoints = require('../../endpoints/metadata/endpoints');
var { withPostStages, withGetStages } = require('./stage-helpers');

var addCRTSettingsRoutes = (bag) => {
    var { router } = bag;

    // FIXME: make it post
    router.get(
        '/crt-settings/read/:collectionName/:recordType',
        ...withGetStages({
            endpoint: endpoints.getCRTSettings,
            enableApiKeyAuth: true,
        })
    );
}

module.exports = addCRTSettingsRoutes;
