'use strict';

var includes = (bag) => {
    var {
        haystack,
        needle,
        compare = (a,b) => a === b
    } = bag;

    for (var it of haystack) {
        if (compare(it, needle)) {
            return true;
        }
    }

    return false;
}

var intersect = (a, b, { compare }) => (
    a.filter(it => includes({ haystack: b, needle: it, compare }))
);

module.exports = intersect;

