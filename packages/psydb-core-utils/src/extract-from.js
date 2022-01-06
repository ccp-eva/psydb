'use strict';
var intersect = require('./intersect');
var without = require('./without');

var extractFrom = (obj, keys) => {
    var extracted = {},
        rest = {};

    var sourceKeys = Object.keys(obj);

    var toExtract = intersect(sourceKeys, keys);
    var toKeep = without(sourceKeys, toExtract);

    for (var k of toExtract) {
        extracted[k] = obj[k];
    }

    for (var k of toKeep) {
        rest[k] = obj[k];
    }
    
    return [ extracted, rest ];
}

module.exports = extractFrom;
