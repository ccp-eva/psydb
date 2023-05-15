'use strict';
var Cache = require('./cache');

var WrappedCache = ({ driver }) => {
    var cache = Cache();

    cache.addId = ({ collection, recordType, as }) => {
        var id = driver.getCache().lastChannelIds[collection];
        if (recordType) {
            cache.merge({ [collection]: { [recordType]: { [as]: id }}});
        }
        else {
            cache.merge({ [collection]: { [as]: id }});
        }
        return id;
    }

    return cache;
}

module.exports = WrappedCache;
