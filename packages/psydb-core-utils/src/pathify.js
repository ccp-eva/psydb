'use strict';
var { flatten } = require('@cdxoo/flat');

var pathify = (that, options = {}) => {
    var {
        delimiter = '.',
        //traverseArrays = false,
        prefix,
        maxDepth,
    } = options;

    var flat = flatten(that, {
        delimiter,
        maxDepth,
        //traverseArrays // FIXME: flatten doesnt pass that down i think
    });

    if (prefix) {
        var out = {};
        for (var key of Object.keys(flat)) {
            out[`${prefix}${delimiter}${key}`] = flat[key];
        }
        return out;
    }
    else {
        return flat;
    }
}

module.exports = pathify;
