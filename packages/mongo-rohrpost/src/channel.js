'use strict';

var Channel = ({
    id,
    isNew,

    db,
    collectionName,
    createMessageId,
    disableChannelLocking,
}) => {
    var channel = {};

    channel.dispatch = (message) => (
        storeChannelEvent({
            isNewChannel: isNew,
            channelId: id,

            id: createMessageId(),
            timestamp: new Date(),
            
            message,

            db,
            collectionName,
            correlationId,
            disableChannelLocking,
        })
    );

    return channel;
}

module.exports = Channel;
