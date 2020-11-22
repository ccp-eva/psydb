'use strict';
var prefix = require('./schema-id-prefix'),
    coreLocationState = require('./core-location-state'),
    createBaseRecord = require('./create-building-baserecord'),

var createBuildingState = (key, customInnerSchema) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/building/${key}/state`,
        allOf: [
            createBaseRecord(key, customInnerSchema),
            coreLocationState,
        ]
    } 
};

module.exports = createBuildingBaseRecord;
