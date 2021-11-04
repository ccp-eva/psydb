'use strict';
var unique = (ary) => (
    ary.filter((it, index, self) => self.indexOf(it) === index)
);

module.exports = unique;
