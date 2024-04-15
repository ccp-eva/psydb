'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');

var makeObjects = (bag) => {
    var { matchedData, skipEmptyValues } = bag;

    var outlist = [];
    for (var row of matchedData) {
        var obj = {};
        for (var cell of row) {
            var { definition, value, extraPath } = cell;
            var { pointer } = definition;
           
            if (skipEmptyValues && value === '') {
                continue;
            }

            var fullPointer = [ pointer, ...extraPath ].join('/');
            jsonpointer.set(obj, fullPointer, value)
        }
        outlist.push(obj)
    }

    return outlist;
}

module.exports = makeObjects;
