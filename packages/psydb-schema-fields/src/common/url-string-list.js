'use strict';
var { DefaultArray } = require('../core-compositions');
var URLString = require('./url-string');

var URLStringList = ({
    minItems,
    ...additionalKeywords
} = {}) => (
    DefaultArray({
        systemType: 'URLStringList',
        minItems: (minItems || 0),
        items: URLString({ minLength: 1 }),
        ...additionalKeywords,
    })
)

module.exports = URLStringList;
