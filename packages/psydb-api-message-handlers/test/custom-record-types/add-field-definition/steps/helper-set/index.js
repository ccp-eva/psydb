'use strict';
var create = require('./create');

var HELPER_SET = (cacheKey) => {
    var out = {};
    return out;
}

HELPER_SET.create = (...pass) => (
    create(...pass)
);

module.exports = HELPER_SET;
