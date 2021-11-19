'use strict';

var without = (a, b) => (
    a.filter(it => !b.includes(it))
)

module.exports = without;
