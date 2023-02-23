'use strict';
var jsonpointer = require('jsonpointer');
var { unescape } = require('@cdxoo/mongodb-escape-keys');
var { entries, isPlainObject } = require('@mpieva/psydb-core-utils');

var SET = (channel, opData) => {
    for (var [ pointer, value ] of entries(opData)) {
        var unescaped = (
            isPlainObject(value)
            ? unescape(value)
            : value
        );
        jsonpointer.set(channel, pointer, unescaped);
    }
}

module.exports = SET;
