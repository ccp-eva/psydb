'use strict';
var { readfileSync } = require('fs');
var fspath = require('path');
var baseDir = __dirname;

var getPath = (type, name) => {
    var path = fspath.join(baseDir, type, `${name}.csv`);
    return path;
};

var getContent = (type, name) => {
    var path = getPath(type, name);
    return readfileSync(path);
}

module.exports = {
    baseDir,
    getPath,
    getContent
};
