'use strict';
var { convertPointerToPath } = require('@mpieva/psydb-core-utils');

var convertPointerKeys = (obj) => {
    if (obj === undefined) {
        return undefined;
    }

    var out = {};
    for (var [ key, value ] of Object.entries(obj)) {
        out[convertPointerToPath(key)] = value;
    }
    return out;
}

module.exports = convertPointerKeys;
