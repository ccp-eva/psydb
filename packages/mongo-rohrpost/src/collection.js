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

    collection.openChannel = ({ id: maybeId } = {}) => (
        Channel({
            id: maybeId || createChannelId(),
            isNew: !maybeId,

            db,
            collectionName: name,
            correlationId,
            createChannelEventId,

            disableChannelLocking,
            modificationCache,
        })
    );

    return collection;
};

module.exports = Collection;
