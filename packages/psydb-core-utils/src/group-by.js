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
    var grouped = items.reduce((acc, item) => {
        var group = [],
            key = createKey(item);
        if (acc[key]) {
            group = acc[key];
        }
        return {
            ...acc,
            [key]: [
                ...group,
                transform(item)
            ]
        };
    }, {});
    
    return grouped;
}

module.exports = groupBy;
