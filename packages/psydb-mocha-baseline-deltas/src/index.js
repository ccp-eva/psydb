'use strict';
var BaselineDeltas = require('./baseline-deltas');
var helpers = require('./delta-helpers');

for (var [ key, fn ] of Object.entries(helpers)) {
    BaselineDeltas[key] = fn;
}

module.exports = {
    BaselineDeltas,
    ...helpers
}
