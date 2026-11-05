'use strict';
var create = require('./create');

var RESEARCH_GROUP = (cacheKey) => {
    var out = {};
    return out;
}

RESEARCH_GROUP.create = (...args) => (
    args.length === 1
    ? create({ as: args[0] })
    : create({ data: args[0], ...args[1] })
)

module.exports = RESEARCH_GROUP;
