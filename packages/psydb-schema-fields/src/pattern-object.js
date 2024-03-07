'use strict';
var PatternObject = ({
    ...patternProperties
}, additionalKeywords) => ({
    type: 'object',
    default: {},
    additionalProperties: false,
    patternProperties,
    ...additionalKeywords,
});

module.exports = PatternObject;
