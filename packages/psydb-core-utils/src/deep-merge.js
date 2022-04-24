'use strict';
var _deepmerge = require('deepmerge');
var { isArray, isPlainObject } = require('is-what');
var concat = (base, x) => ([ ...base, ...x ]);

var deepmerge = (...args) => {
    var options = {
        isMergeableObject: (that) => (
            isPlainObject(that) || isArray(that)
        ),
        arrayMerge: concat,
    };
    return _deepmerge.all(args, options);
}
deepmerge.raw = _deepmerge;

module.exports = deepmerge;
