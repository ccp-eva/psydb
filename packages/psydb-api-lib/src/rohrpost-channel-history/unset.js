'use strict';
var { ejson, entries, jsonpointer } = require('@mpieva/psydb-core-utils');

var UNSET = (channel, opData) => {
    for (var [ pointer, value ] of entries(opData)) {
        var [ lastToken, ...rHead ] = pointer.split('\/').reverse();
        var parentPointer = rHead.reverse().join('/');
        var parent = jsonpointer.get(channel, parentPointer);

        // XXX: hotfix for issue in history subject id
        // 6312c3f99607f23aadf4e2c4
        if (parent) {
            delete parent[lastToken];
        }
    }
}

module.exports = UNSET;
