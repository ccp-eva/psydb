'use strict';
var prefix = require('./schema-id-prefix'),
    coreState = require('../core-state'),
    createBaseRecord = require('./create-baserecord');

var createPersonnelState = () => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/state`,
        allOf: [
            createBaseRecord(),
            coreState,
        ]
    }

    return schema;
};

module.exports = createPersonnelState;
