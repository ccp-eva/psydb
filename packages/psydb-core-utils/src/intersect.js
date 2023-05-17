'use strict';
var includes = require('./includes');

var intersect = (a, b, { compare } = {}) => (
    a.filter(it => includes({ haystack: b, needle: it, compare }))
);

module.exports = intersect;
