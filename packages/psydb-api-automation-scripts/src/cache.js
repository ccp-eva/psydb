'use strict';
var { merge, jsonpointer } = require('@mpieva/psydb-core-utils');

var Cache = () => {
    var cache = {};
    var internal = {};

    cache.merge = (props) => {
        internal = merge(internal, props);
    }

    cache.get = (maybeKeyOrPointer) => {
        if (!maybeKeyOrPointer) {
            return internal;
        }

        if (maybeKeyOrPointer.startsWith('/')) {
            var pointer = maybeKeyOrPointer;
            return jsonpointer.get(internal, pointer);
        }
        else {
            var key = maybeKeyOrPointer;
            return internal[key];
        }
    }

    cache.has = (...keysOrPointers) => {
        var count = 0;
        for (var keyOrPointer of keysOrPointers) {
            var value = undefined;
            if (keyOrPointer.startsWith('/')) {
                var pointer = keyOrPointer;
                value = jsonpointer.get(internal, pointer);
            }
            else {
                value = internal[key]
            }
        
            if (value!== undefined) {
                count += 1;
            }
        }
        
        return count === keysOrPointers.length ? true : false
    }

    return cache;
}

module.exports = Cache;
