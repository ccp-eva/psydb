'use strict';
var OpenObject = ({
    properties,
    required,
    ...additionalKeywords
}) => ({
    type: 'object',
    default: {},
    properties,
    required,
    ...additionalKeywords,
});

module.exports = OpenObject;
