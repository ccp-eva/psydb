'use strict';
var Cache = require('./cache');

var WrappedCache = ({ driver }) => {
    var cache = Cache();

    cache.addId = ({ collection, as }) => {
        var id = driver.getCache().lastChannelIds[collection];
        cache.merge({ [collection]: { [as]: id }});
        return id;
    }

    return cache;
}

module.exports = WrappedCache;
