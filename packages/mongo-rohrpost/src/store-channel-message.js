'use strict';
var queries = require('./queries'),
    isThennable = require('./is-thennable');

var {
    LockingChannelEvent,
    NonLockingChannelEvent
} = require('./channel-events');

module.exports = async ({
    db,
    correlationId,
    collectionName,
    isNewChannel,
    channelId,
    lastKnownEventId,
    disableChannelLocking,

    id,
    subChannelKey,
    timestamp,
    message,
    additionalChannelProps,
}) => {
    if (isThennable(channelId)) {
        channelId = await channelId;
    }
    if (isThennable(id)) {
        id = await id;
    }

    var collection = db.collection(collectionName),
        ChannelEvent = (
            disableChannelLocking 
            ? NonLockingChannelEvent
            : LockingChannelEvent
        );

    var channelEvent = ChannelEvent({
        id,
        timestamp,
        correlationId,
        message,
    });

    var status = undefined;
    if (isNewChannel) {
        status = queries.createNewChannel({
            collection,
            channelId,
            subChannelKey,
            channelEvent,
            additionalChannelProps,
        });
    }
    else {
        if (disableChannelLocking) {
            status = queries.updateAlways({
                collection,
                channelId,
                lastKnownEventId,
                subChannelKey,
                channelEvent,
            });
        }
        else {
            status = queries.updateUnlessLocked({
                collection,
                channelId,
                lastKnownEventId,
                subChannelKey,
                correlationId,
                channelEvent,
            });
        }
    }
    return await status;
}

