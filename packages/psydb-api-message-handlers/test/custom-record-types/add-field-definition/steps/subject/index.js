'use strict';
var create = require('./create');

var SUBJECT = (cacheKey) => {
    var out = {};
    return out;
}

SUBJECT.create = (recordType, data, options = {}) => (
    create({ recordType, data, ...options })
)

module.exports = SUBJECT;
