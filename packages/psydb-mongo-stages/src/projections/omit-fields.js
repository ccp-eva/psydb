'use strict';
var { convertPointerToPath } = require('@mpieva/psydb-core-utils');

var OmitFields = (bag) => {
    var { definitions, pointers } = bag;
    if (!pointers) {
        pointers = definitions.map(it => it.pointer)
    }

    var PROJECTION = {};
    for (var it of pointers) {
        var path = convertPointerToPath(it);
        PROJECTION[path] = false;
    }

    return { $project: PROJECTION }
}

module.exports = OmitFields;
