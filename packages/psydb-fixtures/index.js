'use strict';
var fspath = require('path');
var baseDir = require('./dir');

var getFixturePath = (dumpName, { db = false } = {}) => {
    var dump = fspath.join(baseDir, 'bson', dumpName);
    if (db) {
        return fspath.join(dump, 'psydb');
    }
    else {
        return dump;
    }
};

module.exports = getFixturePath;
