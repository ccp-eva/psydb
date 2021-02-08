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
    disableLastEventIdCheck,
    modificationCache,
}) => {
    var channel = {};

    channel.dispatch = ({
        message,
        subChannelKey,
        lastKnownEventId,
    }) => {
        return channel.dispatchMany({
            messages: [ message ],
            subChannelKey,
            lastKnownEventId,
        });
    }

    channel.dispatchMany = async ({
        messages,
        subChannelKey,
        lastKnownEventId,
    }) => {
        if (!Array.isArray(messages)) {
            throw new TypeError('parameter "messages" must be an array');
        }

        if (isThennable(id)) {
            id = await id;
        }

        var { insertedId, lastKnownEventId } = await storeChannelMessage({
            isNewChannel: isNew,
            channelId: id,
            lastKnownEventId,
            createChannelEventId,

            subChannelKey,

            // messages must be in reverse since the latest
            // is always the latest is always in position 0
            // of the event array in the mongo doc due to constraints
            // in mongodb regarding array element queries
            messages: [ ...messages ].reverse(),
            additionalChannelProps,

            db,
            collectionName,
            correlationId,
            disableChannelLocking,
            disableLastEventIdCheck,
        });

        // store id for possible next dispatch
        if (isNew) {
            id = insertedId;
            isNew = false;
        }

        modificationCache.add({
            collectionName,
            channelId: id,
            subChannelKey,
            lastKnownEventId,
        });
        
        return {
            channelId: id,
            lastKnownEventId,
        };
    };

    return channel;
}

module.exports = Channel;
