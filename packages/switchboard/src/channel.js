'use strict';

var Channel = ({
    id,
    isNew,
    rohrpostKey,

    createMessageId,
    onDispatch,
}) => {
    var channel = {};

    channel.dispatch = (message, correlationId) => (
        onDispatch({
            isNewChannel: isNew,
            channelId: id,

            id: createMessageId(),
            timestamp: new Date(),
            
            message,
            correlationId,
            rohrpostKey,
        })
    );

    return channel;
}

module.exports = Channel;
