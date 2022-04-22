'use strict';
var _deepmerge = require('deepmerge');
var { isPlainObject } = require('is-what');

var deepmerge = (...args) => {
    var options = {
        isMergeableObject: isPlainObject
    };
    return _deepmerge.all(args, options);
}
deepmerge.raw = _deepmerge;

module.exports = deepmerge;
