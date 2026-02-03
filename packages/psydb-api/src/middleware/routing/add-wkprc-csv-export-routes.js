'use strict';
var endpoints = require('@mpieva/psydb-api-endpoints');
var { withPostStages, withGetStages } = require('./stage-helpers');

var addWKPRCCSVExportRoutes = (bag) => {
    var { router } = bag;

    router.post(
        '/wkprc-csv-export/participation',
        ...withPostStages({
            endpoint: endpoints.wkprcCSVExport.participation
        })
    );
}

module.exports = addWKPRCCSVExportRoutes;
