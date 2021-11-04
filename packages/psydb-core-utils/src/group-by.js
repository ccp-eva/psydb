'use strict';
var jsonpointer = require('jsonpointer');

var groupBy = ({
    items,
    byProp,
    byPointer,
    createKey
}) => {
    if (byProp) {
        createKey = (item) => item[byProp];
    }
    else if (byPointer) {
        createKey = (item) => jsonpointer.get(item, byPointer);
    }
    return genericGroupBy({
        items,
        createKey,
    });
}

var genericGroupBy = ({ items, createKey }) => {
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
                item
            ]
        };
    }, {});
    
    return grouped;
}

module.exports = groupBy;
