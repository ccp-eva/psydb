'use strict';

var BasicObject = (properties, additionalKeywords = {}) => ({
    type: 'object',
    properties,
    ...additionalKeywords
});

module.exports = BasicObject;
