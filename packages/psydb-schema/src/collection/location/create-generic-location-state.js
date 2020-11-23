'use strict';
var prefix = require('./schema-id-prefix'),
    coreLocationState = require('./core-location-state'),
    createBaseRecord = require('./create-generic-location-baserecord');

var createGenericLocationState = (key, customInnerSchema) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/${key}/state`,
        allOf: [
            createBaseRecord(key, customInnerSchema),
            coreLocationState,
        ]
    }

    return schema;
};

module.exports = createGenericLocationState;
