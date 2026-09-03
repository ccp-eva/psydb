'use strict';
var kebab = require('just-kebab-case');
var { FieldDefinitionSchemas } = require('@mpieva/psydb-common-lib');

var out = {};
for (var systemType of Object.keys(FieldDefinitionSchemas)) {
    var fn = undefined;
    try {
        fn = require(`./${kebab(systemType)}.step.js`);
    }
    catch (e) {
        fn = () => step(systemType, async function () {
            throw e;
        })
    }
    out[systemType] = fn;
}

module.exports = out;
