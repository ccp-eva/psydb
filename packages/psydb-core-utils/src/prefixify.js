'use strict';

var prefixify = (bag) => {
    var {
        values,
        prefix,
        delimiter = '.'
    } = bag;
    
    var out = {};
    for (var key of Object.keys(values)) {
        out[`${prefix}${delimiter}${key}`] = values[key];
    }
    return out;
}

module.exports = prefixify;
