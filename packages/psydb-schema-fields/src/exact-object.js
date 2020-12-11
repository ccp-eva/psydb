'use strict';
var ExactObject = ({
    properties,
    required,
    ...additionalKeywords
}) => ({
    type: 'object',
    default: {},
    additionalProperties: false,
    properties,
    required,
    ...additionalKeywords,
});

module.exports = ExactObject;
