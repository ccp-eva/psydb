'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');

var Cache = () => {
    var cache = {};
    
    cache.lastKnownEventIds_short = {};
    cache.lastKnownEventIds = {};
    cache.lastChannelIds = {};

    cache.setLastKnownEventId = ({
        collectionName, subChannelKey, channelId, lastKnownEventId
    }) => {
        var path = (
            subChannelKey === undefined
            ? `/${collectionName}/${channelId}`
            : `/${collectionName}/${subChannelKey}/${channelId}`
        );
        jsonpointer.set(
            cache.lastKnownEventIds,
            path,
            lastKnownEventId
        );
        var path_short = (
            subChannelKey === undefined
            ? `/${channelId}`
            : `/${channelId}/${subChannelKey}`
        );
        jsonpointer.set(
            cache.lastKnownEventIds_short,
            path_short,
            lastKnownEventId
        );
    }

    cache.setLastChannelId = ({
        collectionName, channelId
    }) => {
        cache.lastChannelIds[collectionName] = channelId;
    }

    cache.clear = () => {
        cache.lastKnownEventIds = {};
        cache.lastChannelIds = {};
    }

    return cache;
}

module.exports = Cache;
