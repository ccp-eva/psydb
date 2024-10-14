'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');

var pmap = (items, pointer, options) => {
    var { spreadArrays = false } = options;

    var out = [];
    for (var it of items) {
        var value = jsonpointer.get(it, pointer);
        if (Array.isArray(value) && spreadArrays) {
            out.push(...value);
        }
        else {
            out.push(value);
        }
    }

    return out;
}
var mappifyPointer = (items, options = {}) => (pointer) => (
    pmap(items, pointer, options)
);

module.exports = mappifyPointer;
