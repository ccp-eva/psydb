'use strict';
var storeChannelEvent = require('./store-channel-event');

var Channel = ({
    id,
    isNew,
    additionalChannelProps,

    db,
    collectionName,
    correlationId,
    createChannelEventId,

    disableChannelLocking,
    modificationCache,
}) => {
    var channel = {};

    channel.dispatch = async ({ message, subChannelKey }) => {
        var r = await storeChannelEvent({
            isNewChannel: isNew,
            channelId: id,

            subChannelKey,

            id: createChannelEventId(),
            timestamp: new Date(),
            
            message,
            additionalChannelProps,

            db,
            collectionName,
            correlationId,
            disableChannelLocking,
        });

        modificationCache.add({
            collectionName,
            id: (
                isNew
                ? r.insertedId
                : id
            ),
            subChannelKey,
        });
        
        // store id for possible next dispatch
        if (isNew) {
            id = r.insertedId;
            isNew = false;
        }

        //console.log(r);
        return r;
    };

    return channel;
}

module.exports = Channel;
