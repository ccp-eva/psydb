'use strict';
var SaneString = require('./sane-string');

var SaneStringList = ({ title, minItems }) => ({
    title: title,
    systemType: 'SaneStringList',
    type: 'array',
    default: [],
    minItems: (minItems || 0),
    items: SaneString({ minLength: 1 })
})

module.exports = SaneStringList;
