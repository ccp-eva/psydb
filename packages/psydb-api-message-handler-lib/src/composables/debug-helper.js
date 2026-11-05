'use strict';
var Debug = require('../debug-helper');
module.exports = (path) => (
    Debug(`composables:${path}`)
)
