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
        latestKnownMessageId
    }) => {
        var existing = !!(items.filter(it => (
            it.collectionName === collectionName
            && it.channelId === channelId
            && it.subChannelKey === subChannelKey
        )));

        if (existing.length) {
            existing.forEach(item => {
                item.latestKnownMessageId = latestKnownMessageId;
            })
        }
        else {
            items.push({
                collectionName,
                channelId,
                subChannelKey,
                latestKnownMessageId
            });
        }
    }

    return cache;
}

module.exports = ModificationCache;
