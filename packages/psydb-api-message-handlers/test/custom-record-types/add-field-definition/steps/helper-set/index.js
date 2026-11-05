'use strict';
var create = require('./create');
var createItem = require('./create-item');

var HELPER_SET = (cacheKey) => {
    var out = {};
    
    for (var fnkey of [
        'createItem'
    ]) {
        out[fnkey] = (itemKey, options) => (
            HELPER_SET[fnkey](itemKey, {
                withCachedHelperSet: cacheKey, ...options
            })
        )
    }
    return out;
}

HELPER_SET.create = (...pass) => (
    create(...pass)
);

HELPER_SET.createItem = (itemKey, options) => (
    createItem({ itemKey, ...options })
)

module.exports = HELPER_SET;
