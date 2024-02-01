'use strict';
var arrify = (a, options = {}) => {
    var { removeNullishScalar = false } = options;

    if (removeNullishScalar && (a === null || a === undefined)) {
        return []
    }

    return Array.isArray(a) ? a : [ a ];
};

module.exports = arrify;
