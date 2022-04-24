'use strict';
var jsonpointer = require('jsonpointer');

var forcePush = (bag) => {
    var { into: that, pointer, values } = bag;

    if (!jsonpointer.get(that, pointer)) {
        jsonpointer.set(that, pointer, []);
    }
    jsonpointer.get(that, pointer).push(...values);
}

module.exports = forcePush;
