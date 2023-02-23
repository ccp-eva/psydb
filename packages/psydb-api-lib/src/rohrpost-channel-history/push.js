'use strict';
var jsonpointer = require('jsonpointer');
var { unescape } = require('@cdxoo/mongodb-escape-keys');
var {
    entries, isPlainObject, forcePush
} = require('@mpieva/psydb-core-utils');

var PUSH = (channel, opData) => {
    for (var [ pointer, value ] of entries(opData)) {
        var unescaped = (
            isPlainObject(value)
            ? unescape(value)
            : value
        );
        forcePush({ into: channel, pointer, values: (
            unescaped['$each'] || [ unescaped ]
        )})
    }
}

module.exports = PUSH;
