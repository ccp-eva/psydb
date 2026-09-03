'use strict';
var build_step = require('./build-add-field-definition-step');
var variants = {};

variants['SaneString'] = build_step({
    systemType: 'SaneString',
    definitionOptions: {
        'minLength': 0
    },
    extraExpectedDefinitionOptions: {}
});

module.exports = variants;
