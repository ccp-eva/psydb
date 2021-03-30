'use strict';
var jsonpointer = require('jsonpointer');

var groupBy = ({ items, byPointer, createKey }) => {
    return genericGroupBy({
        items,
        createKey: createKey || ((item) => jsonpointer.get(item, byPointer))
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
