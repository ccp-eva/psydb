'use strict';
var Cache = require('./cache');

var WrappedCache = ({ driver }) => {
    var cache = Cache();

    cache.addCRT = ({ _id, key, as }) => {
        cache.merge({ 'customRecordType': {
            [as || key]: _id
        }});
    }
    cache.addId = ({ collection, recordType, id, as }) => {
        if (!id) {
            id = driver.getCache().lastChannelIds[collection];
        }
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
