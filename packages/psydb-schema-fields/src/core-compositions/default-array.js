'use strict';
var BasicArray = require('./basic-array');

var DefaultArray = ({ items, ...additionalKeywords }) => (
    BasicArray(items, { default: [], ...additionalKeywords })
);

module.exports = DefaultArray;
