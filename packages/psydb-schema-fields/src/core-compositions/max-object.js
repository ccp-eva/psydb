'use strict';
var MaxObject = (...args) => {
    var [ properties, additionalKeywords = {} ] = args;

    return {
        type: 'object',
        default: {},
        additionalProperties: false,
        properties: properties,
        required: [],
        ...additionalKeywords,
    }
}

module.exports = MaxObject;
