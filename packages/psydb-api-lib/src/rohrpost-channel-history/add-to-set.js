'use strict';
var jsonpointer = require('jsonpointer');
var { unescape } = require('@cdxoo/mongodb-escape-keys');
var {
    entries, isPlainObject, forcePush
} = require('@mpieva/psydb-core-utils');

var ADD_TO_SET = (channel, opData) => {
    for (var [ pointer, payload ] of entries(opData)) {
        var unescaped = (
            isPlainObject(payload)
            ? unescape(payload)
            : payload
        );

        var values = unescaped['$each'] || [ unescaped ];
        for (var v of values) {
            var current = jsonpointer.get(channel, pointer) || [];
            // XXX String
            if (!current.map(String).includes(String(v))) {
                forcePush({ into: channel, pointer, values: [ v ]});
            }
        }

    }
}

module.exports = ADD_TO_SET;
