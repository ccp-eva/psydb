'use strict';
var ExactObject = ({
    properties,
    required,
    ...additionalKeywords
}) => ({
    systemType: 'ExactObject',
    type: 'object',
    default: {},
    additionalProperties: false,
    properties,
    required,
    ...additionalKeywords,
});

module.exports = ExactObject;
