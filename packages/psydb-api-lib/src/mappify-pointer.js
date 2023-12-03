'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');

var pmap = (items, pointer) => (
    items.map(it => jsonpointer.get(it, pointer))
);
var mappifyPointer = (items) => (pointer) => (
    pmap(items, pointer)
);

module.exports = mappifyPointer;
