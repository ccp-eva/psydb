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
        lastKnownMessageId
    }) => {
        var existing = !!(items.filter(it => (
            it.collectionName === collectionName
            && it.channelId === channelId
            && it.subChannelKey === subChannelKey
        )));

        if (existing.length) {
            existing.forEach(item => {
                item.lastKnownMessageId = lastKnownMessageId;
            })
        }
        else {
            items.push({
                collectionName,
                channelId,
                subChannelKey,
                lastKnownMessageId
            });
        }
    }

    return cache;
}

module.exports = ModificationCache;
