'use strict';
var { DefaultArray } = require('../core-compositions');
var Id = require('./id');

var IdList = ({
    minItems,
    ...additionalKeywords
} = {}) => (
    DefaultArray({
        systemType: 'IdList',
        minItems: (minItems || 0),
        items: Id(),
        ...additionalKeywords,
    })
)

module.exports = IdList;
