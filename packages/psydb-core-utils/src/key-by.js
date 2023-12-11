'use strict';
var jsonpointer = require('jsonpointer');
var defaultTransform = it => it;

var keyBy = (options) => {
    var {
        items,
        byPointer,
        byProp,
        createKey,

        transform = defaultTransform
    } = options;

    if (byProp) {
        createKey = (item) => item[byProp];
    }
    else if (byPointer) {
        createKey = (item) => jsonpointer.get(item, byPointer);
    }
    return genericKeyBy({
        items,
        createKey,
        transform,
    });
}

var genericKeyBy = ({ items, createKey, transform }) => {
    var out = {};
    for (var item of items) {
        out[createKey(item)] = transform ? transform(item) : item;
    }
    return out;
}

module.exports = keyBy;
