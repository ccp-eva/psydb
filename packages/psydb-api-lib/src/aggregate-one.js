'use strict';
var aggregateToArray = require('./aggregate-to-array');

var aggregateOne = async (bag) => {
    var [ out ] = await aggregateToArray(bag);
    return out;
}

module.exports = aggregateOne;
