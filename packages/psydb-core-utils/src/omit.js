'use strict';
var jsonpointer = require('jsonpointer');
var convertPathToPointer = require('@cdxoo/objectpath-to-jsonpointer');
var { flatten, unflatten } = require('@cdxoo/flat');
var entries = require('./entries');

var omit = (bag) => {
    var { from, fromItems, ...pass } = bag;
    if (!from && !fromItems) {
        throw new Error('either "from" or "fromItems" must be set');
    }

    if (fromItems) {
        return fromItems.map(it => omitOne({
            from: it, ...pass
        }));
    }
    else {
        return omitOne({ from, ...pass });
    }
}

var omitOne = (bag) => {
    var { from, paths } = bag;
    if (Object.keys(from).length < 1) {
        return {};
    }

    var flatted = flatten(from);

    var out = {};
    for (var [ key, value ] of entries(flatted)) {
        var isExcluded = false;
        for (var path of paths) {
            var pointer = convertPathToPointer(path);
            if (convertPathToPointer(key).startsWith(pointer)) {
                isExcluded = true;
            }
        }
        if (!isExcluded) {
            out[key] = value;
        }
    }
    return unflatten(out);
}

module.exports = omit;
