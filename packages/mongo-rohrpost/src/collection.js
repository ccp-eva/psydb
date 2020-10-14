'use strict';
var Channel = require('./channel');

var Collection = ({
    name,

    db,
    correlationId,
    createChannelId,
    createMessageId,
    disableChannelLocking,
}) => {
    var collection = {};

    collection.openChannel = ({ id: maybeId }) => (
        Channel({
            id: maybeId || createChannelId(),
            isNew: !maybeId,

            db,
            collectionName: name,
            correlationId,
            createMessageId,
            disableChannelLocking,
        })
    );

    return collection;
};

module.exports = Collection;
