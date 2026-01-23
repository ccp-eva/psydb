'use strict';
var SaneString = require('./sane-string');

var SaneStringList = ({ title, minItems, minLength = 1 } = {}) => ({
    title: title,
    systemType: 'SaneStringList',
    type: 'array',
    default: [],
    minItems: (minItems || 0),
    items: SaneString({ minLength })
})

module.exports = SaneStringList;
