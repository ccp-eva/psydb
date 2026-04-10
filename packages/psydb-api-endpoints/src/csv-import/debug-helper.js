'use strict';
var Debug = require('../debug-helper')
module.exports = (path) => (
    Debug(`csvImport:${path}`)
)
