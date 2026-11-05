'use strict';
var PatternObject = (...args) => {
    var [ patternProperties, extra = {} ] = args;
    
    return {
        type: 'object',
        default: {},
        additionalProperties: false,
        patternProperties,
        ...extra,
    }
}

module.exports = PatternObject;
