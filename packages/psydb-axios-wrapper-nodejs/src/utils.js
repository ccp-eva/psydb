'use strict';

var isFunction = (that) => {
    var type = Object.prototype.toString.call(that).slice(8, -1);
    return type === 'Function';
}

var isString = (that) => {
    var type = Object.prototype.toString.call(that).slice(8, -1);
    return type === 'String';
}

module.exports = { isFunction, isString };
