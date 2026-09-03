'use strict';
var build_step = require('./build-add-field-definition-step');

var ADD_SANE_STRING_FIELD = build_step({
    systemType: 'SaneString',
    definitionOptions: {
        'minLength': 0
    },
    extraExpectedDefinitionOptions: {}
});

module.exports = ADD_SANE_STRING_FIELD;
