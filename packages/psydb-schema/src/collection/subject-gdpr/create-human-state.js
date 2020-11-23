'use strict';
var prefix = require('./schema-id-prefix'),
    coreState = require('./core-subject-gdpr-state'),
    createBaseRecord = require('./create-human-baserecord');

var createHumanState = (key, customInnerSchema) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/human/${key}/state`,
        allOf: [
            createBaseRecord(key, customInnerSchema),
            coreState,
        ]
    }

    return schema;
};

module.exports = createHumanState;
