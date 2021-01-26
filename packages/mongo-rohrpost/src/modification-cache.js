'use strict';
var ModificationCache = () => {
    var cache = {},
        items = [];

    cache.all = () => ([ ...items ]);
    
    cache.clear = () => {
        items = []
    };

    cache.add = ({
        collectionName,
        channelId,
        subChannelKey,
        lastKnownEventId
    }) => {
        var existing = !!(items.filter(it => (
            it.collectionName === collectionName
            && it.channelId === channelId
            && it.subChannelKey === subChannelKey
        )));

        if (existing.length) {
            existing.forEach(item => {
                item.lastKnownEventId = lastKnownEventId;
            })
        }
        else {
            items.push({
                collectionName,
                channelId,
                subChannelKey,
                lastKnownEventId
            });
        }
    }

    return cache;
}

module.exports = ModificationCache;
