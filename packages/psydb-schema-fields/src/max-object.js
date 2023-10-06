'use strict';
var MaxObject = ({
    ...properties
}, additionalKeywords) => ({
    type: 'object',
    default: {},
    additionalProperties: false,
    properties: properties,
    required: [],
    ...additionalKeywords,
});

module.exports = MaxObject;
