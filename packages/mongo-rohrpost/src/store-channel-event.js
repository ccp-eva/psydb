'use strict';
var queries = require('./queries'),
    events = require('./events'),
    isThennable = require('./is-thennable');

module.exports = async ({
    db,
    correlationId,
    collectionName,
    isNewChannel,
    channelId,
    lastKnownMessageId,
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
        Event = (
            disableChannelLocking 
            ? events.NonLockingEvent 
            : events.LockingEvent
        );

    var event = Event({
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
            event,
            additionalChannelProps,
        });
    }
    else {
        if (disableChannelLocking) {
            status = queries.updateAlways({
                collection,
                channelId,
                lastKnownMessageId,
                subChannelKey,
                event,
            });
        }
        else {
            status = queries.updateUnlessLocked({
                collection,
                channelId,
                lastKnownMessageId,
                subChannelKey,
                correlationId,
                event,
            });
        }
    }
    return await status;
}

