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

includes.lambda = (bagB) => (bagA) => includes({ ...bagB, ...bagA });

module.exports = includes;
