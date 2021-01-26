'use strict';
var storeChannelMessage = require('./store-channel-message'),
    isThennable = require('./is-thennable');

var Channel = ({
    id,
    isNew,
    additionalChannelProps,

    db,
    collectionName,
    correlationId,
    createChannelEventId, // TODO: rename createChannelMessageId

    disableChannelLocking,
    modificationCache,
}) => {
    var channel = {};

    channel.dispatch = async ({
        message,
        subChannelKey,
        lastKnownMessageId,
    }) => {
        var channelId = id,
            nextMessageId = createChannelEventId();

        if (isThennable(channelId)) {
            channelId = await channelId;
        }
        if (isThennable(nextMessageId)) {
            nextMessageId = await nextMessageId;
        }

        var r = await storeChannelMessage({
            isNewChannel: isNew,
            channelId,
            lastKnownMessageId,

            subChannelKey,

            id: nextMessageId,
            timestamp: new Date(),
            
            message,
            additionalChannelProps,

            db,
            collectionName,
            correlationId,
            disableChannelLocking,
        });
        
        var { insertedCount, matchedCount } = r;
        //console.log(r);
        if (isNew) {
            if (insertedCount < 1) {
                throw new Error('could not create channel');
            }
        }
        else {
            if (!matchedCount) {
                throw new Error('channel did not match criteria for update');
            }
        }

        modificationCache.add({
            collectionName,
            channelId: (
                isNew
                ? r.insertedId
                : id
            ),
            subChannelKey,
            lastKnownMessageId: nextMessageId
        });
        
        // store id for possible next dispatch
        if (isNew) {
            id = r.insertedId;
            isNew = false;
        }

        return {
            channelId: (
                isNew
                ? r.insertedId
                : id
            ),
            lastKnownMessageId: nextMessageId
        };
    };

    return channel;
}

module.exports = Channel;
