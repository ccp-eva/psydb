'use strict';
var fspath = require('path');

var uiPath = fspath.dirname(require.resolve('@mpieva/psydb-ui'));
var bundlePath = fspath.join(uiPath, '..', 'dist'); // FIXME: '..'

module.exports = bundlePath;
