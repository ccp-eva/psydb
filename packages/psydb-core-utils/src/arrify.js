'use strict';
var arrify = (a) => (
    Array.isArray(a) ? a : [ a ]
);

module.exports = arrify;
