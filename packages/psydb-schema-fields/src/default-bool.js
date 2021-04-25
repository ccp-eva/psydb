'use strict';
var BasicBool = require('./basic-bool');

var DefaultBool = ({
    ...additionalKeywords
} = {}) => BasicBool({
    default: false,
    ...additionalKeywords
});

module.exports = DefaultBool;
