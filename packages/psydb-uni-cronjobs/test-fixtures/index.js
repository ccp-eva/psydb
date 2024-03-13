'use strict';
var fspath = require('path');
var baseDir = __dirname;

var getPath = (name) => {
    var path = fspath.join(baseDir, 'eml', `${name}.eml`);
    return path;
};

var getContent = (name) => {
    var path = getPath(name);
    var content = readFileSync(path);
    return content;
}

module.exports = {
    baseDir,
    getPath,
    getContent,
};
