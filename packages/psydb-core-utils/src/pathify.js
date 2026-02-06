'use strict';
var { flatten } = require('@cdxoo/flat');

var pathify = (that, options = {}) => {
    var {
        delimiter = '.',
        traverseArrays = false,
        prefix,
        maxDepth,
    } = options;

    var flat = flatten(that, {
        delimiter, maxDepth, traverseArrays
    });

    // NOTE: this is a breaking change but i dont we have case
    // were it makes a difference
    if (prefix !== undefined) {
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
