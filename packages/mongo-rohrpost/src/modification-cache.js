'use strict';
var ModificationCache = () => {
    var cache = {},
        items = [];

    cache.all = () => ([ ...items ]);
    
    cache.clear = () => {
        items = []
    };

    cache.add = ({ collectionName, id, subChannelKey }) => {
        var exists = !!(items.filter(it => (
            it.collectionName === collectionName
            && it.id === id
            && it.subChannelKey === subChannelKey
        )).length);

        if (!exists) {
            items.push({ collectionName, id, subChannelKey });
        }
    }

    return cache;
}

module.exports = ModificationCache;
