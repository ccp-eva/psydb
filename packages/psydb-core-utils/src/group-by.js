'use strict';
var jsonpointer = require('jsonpointer');
var defaultTransform = it => it;

var groupBy = (options) => {
    var {
        items,
        byProp,
        byPointer,
        createKey,

        transform = defaultTransform
    } = options;

    if (byProp) {
        createKey = (item) => item[byProp];
    }
    else if (byPointer) {
        createKey = (item) => jsonpointer.get(item, byPointer);
    }
    return genericGroupBy({
        items,
        createKey,
        transform,
    });
}

var genericGroupBy = ({ items, createKey, transform }) => {
    var grouped = {};
    for (var item of items) {
        var key = createKey(item);

        if (!grouped[key]) {
            grouped[key] = [];
        }

        grouped[key].push(transform(item));
    }
    return grouped;
}

module.exports = groupBy;
