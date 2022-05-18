'use strict';
var entries = (that) => (
    Object.keys(that)
    .map(key => ([
        key,
        that[key]
    ]))
);
module.exports = entries;
