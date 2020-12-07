'use strict';
var storeChannelEvent = require('./store-channel-event');

var Channel = ({
    id,
    isNew,

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
        
        //console.log(r);
        return r;
    };

    return channel;
}

module.exports = Channel;
