'use strict';

var intersect = (a, b) => (
    a.filter(it => b.includes(it))
);

module.exports = intersect;

