'use strict';
var { ejson, entries, jsonpointer } = require('@mpieva/psydb-core-utils');

var UNSET = (channel, opData) => {
    for (var [ pointer, value ] of entries(opData)) {
        var [ lastToken, ...rHead ] = pointer.split('\/').reverse();
        var parentPointer = rHead.reverse().join('/');
        var parent = jsonpointer.get(channel, parentPointer);
        delete parent[lastToken];
    }
}

module.exports = UNSET;
