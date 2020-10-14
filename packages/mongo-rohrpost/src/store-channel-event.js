'use strict';
var queries = require('./queries'),
    events = require('./events');

var storeChannelEvent = async ({
    db,
    correlationId,
    collectionName,
    channelId,
    isNewChannel,
    disableChannelLocking,

    id,
    timestamp,
    message
}) => {
    if (thennable(channelId)) {
        channelId = await channelId;
    }
    if (thennable(id)) {
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
            event
        });
    }
    else {
        if (disableChannelLocking) {
            status = queries.updateAlways({
                collection,
                channelId,
                event
            });
        }
        else {
            status = queries.updateUnlessLocked({
                collection,
                channelId,
                correlationId,
                event
            });
        }
    }
    return await status;
}

