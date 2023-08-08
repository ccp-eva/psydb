'use strict';
var Cache = () => {
    var cache = {};
    var internal = {};
    // XXX: until switch-koa-compose can handle this stuff
    cache._internal = internal;

    cache.merge = (props) => {
        // XXX: until switch-koa-compose can handle this stuff
        cache._internal = internal = {
            ...internal,
            ...props,
        }
    }

    cache.get = (maybeProp) => (
        maybeProp !== undefined
        ? internal[maybeProp]
        : internal
    )

    cache.has = (...keys) => {
        var count = 0;
        for (var key of keys) {
            if (internal[key] !== undefined) {
                count += 1;
            }
        }
        
        return count === keys.length ? true : false
    }

    return cache;
}

module.exports = Cache;
