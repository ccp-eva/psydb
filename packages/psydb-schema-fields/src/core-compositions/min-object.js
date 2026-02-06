'use strict';
var MinObject = (...args) => {
    var [ properties, additionalKeywords = {} ] = args;

    return {
        type: 'object',
        default: {},
        additionalProperties: true,
        properties: properties,
        required: Object.keys(properties),
        ...additionalKeywords,
    }
}

module.exports = MinObject;
