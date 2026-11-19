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
    
    router.post('/crt-settings/read-many', ...withPostStages({
        endpoint: endpoints_SPLIT.crtSettings.readMany
    }));

    // NOTE: root only; used to move crts to another system
    router.get('/crt-settings/export', ...withGetStages({
        endpoint: endpoints_SPLIT.crtSettings.export,
        enableApiKeyAuth: true,
    }));
}

module.exports = addCRTSettingsRoutes;
