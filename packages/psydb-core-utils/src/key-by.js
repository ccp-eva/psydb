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
    var keyed = items.reduce((acc, item) => ({
        ...acc,
        [createKey(item)]: transform(item)
    }), {});

    return keyed;
}

module.exports = keyBy;
