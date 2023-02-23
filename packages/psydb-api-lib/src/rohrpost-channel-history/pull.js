'use strict';
var jsonpointer = require('jsonpointer');
var sift = require('sift');
var { unescape } = require('@cdxoo/mongodb-escape-keys');
var { entries, isPlainObject } = require('@mpieva/psydb-core-utils');

var PULL = (channel, opData) => {
    for (var [ pointer, value ] of entries(opData)) {
        var unescaped = (
            isPlainObject(value)
            ? unescape(value)
            : value
        );
        var target = jsonpointer.get(channel, pointer);
        var updated = target.filter((...args) => !sift(unescaped)(...args));
        
        target.splice(0, target.length);
        target.push(...updated);
    }
}

module.exports = PULL;
