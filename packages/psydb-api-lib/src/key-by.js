'use strict';
var jsonpointer = require('jsonpointer');

var keyBy = ({ items, byPointer, createKey }) => {
    return genericKeyBy({
        items,
        createKey: createKey || ((item) => jsonpointer.get(item, byPointer))
    });
}

var genericKeyBy = ({ items, createKey }) => {
    var keyed = items.reduce((acc, item) => ({
        ...acc,
        [createKey(item)]: item
    }), {});

    return keyed;
}

module.exports = keyBy;
