'use strict';
var jsonpointer = require('jsonpointer');

var keyBy = ({
    items,
    byPointer,
    createKey,
    byProp
}) => {
    if (byProp) {
        createKey = (item) => item[byProp];
    }
    else if (byPointer) {
        createKey = (item) => jsonpointer.get(item, byPointer);
    }
    return genericKeyBy({
        items,
        createKey,
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
