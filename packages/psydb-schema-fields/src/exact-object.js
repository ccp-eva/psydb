'use strict';
var ExactObject = ({
    properties,
    required,
    ...additionalKeywords
}) => ({
    type: 'object',
    additionalProperties: false,
    properties,
    required,
    ...additionalKeywords,
});

module.exports = ExactObject;
