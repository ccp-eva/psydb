'use strict';
var ClosedObject = ({
    ...properties
}, additionalKeywords) => ({
    type: 'object',
    default: {},
    additionalProperties: false,
    properties: properties,
    required: Object.keys(properties),
    ...additionalKeywords,
});

module.exports = ClosedObject;
