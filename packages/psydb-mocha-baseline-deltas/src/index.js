'use strict';
var wrapper = require('@cdxoo/chai-baseline-deltas');
var extraHelpers = require('./delta-helpers');

for (var [ key, fn ] of Object.entries(extraHelpers)) {
    wrapper[key] = fn;
    wrapper.BaselineDeltas[key] = fn;
}

module.exports = wrapper;
