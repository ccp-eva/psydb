'use strict';
var ModificationCache = () => {
    var cache = {},
        items = [];

    cache.all = () => ([ ...items ]);
    
    cache.clear = () => {
        items = []
    };

    cache.add = ({ collectionName, id }) => {
        var exists = !!(items.filter(it => (
            it.collectionName === collectionName && it.id === id
        )).length);

        if (!exists) {
            items.push({ collectionName, id });
        }
    }

    return cache;
}

module.exports = ModificationCache;
