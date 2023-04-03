'use strict';
var BasicBool = require('./basic-bool');

var DefaultBool = ({
    ...additionalKeywords
} = {}) => BasicBool({
    systemType: 'DefaultBool',
    default: false,
    ...additionalKeywords
});

module.exports = DefaultBool;
