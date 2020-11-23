'use strict';
var prefix = require('./schema-id-prefix'),
    coreState = require('./core-subject-scientific-state'),
    createBaseRecord = require('./create-animal-baserecord');

var createAnimalState = (key, customInnerSchema) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/animal/${key}/state`,
        allOf: [
            createBaseRecord(key, customInnerSchema),
            coreState,
        ]
    }

    return schema;
};

module.exports = createAnimalState;
