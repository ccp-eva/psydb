'use strict';
var Channel = require('./channel');

var Collection = ({
    name,

    db,
    correlationId,
    createChannelId,
    createChannelEventId,

    disableChannelLocking,
    modificationCache,
}) => {
    var collection = {};

    collection.openChannel = ({
        id: maybeId,
        isNew,
        additionalChannelProps,
    } = {}) => (
        Channel({
            id: maybeId || createChannelId(),
            isNew: isNew || !maybeId,

            db,
            collectionName: name,
            correlationId,
            createChannelEventId,
            additionalChannelProps,

            disableChannelLocking,
            modificationCache,
        })
    );

    return collection;
};

module.exports = Collection;
