'use strict';
var queries = require('./queries'),
    isThennable = require('./is-thennable');

var {
    ChannelCreationFailed,
    ChannelUpdateFailed
} = require('./errors');

var {
    LockingChannelEvent,
    NonLockingChannelEvent
} = require('./channel-events');

var createChannelEvents = async ({
    timestamp,
    correlationId,
    createChannelEventId,
    disableChannelLocking,
    messages
}) => {
    var ChannelEvent = (
        disableChannelLocking 
        ? NonLockingChannelEvent
        : LockingChannelEvent
    );

    var events = [];
    for (var message of messages) {
        var id = createChannelEventId();
        if (isThennable(id)) {
            id = await id;
        }
        events.push(ChannelEvent({
            id,
            timestamp,
            correlationId,
            message,
        }));
    }
    return { 
        channelEvents: events,
        nextEventId: events[events.length - 1]._id,
    };
}

module.exports = async ({
    db,
    correlationId,
    collectionName,
    isNewChannel,
    channelId,
    createChannelEventId,
    lastKnownEventId,
    disableChannelLocking,

    subChannelKey,
    messages,
    additionalChannelProps,
}) => {
    var collection = db.collection(collectionName);

    var { channelEvents, nextEventId } = await createChannelEvents({
        timestamp: new Date(),
        correlationId,
        createChannelEventId,

        messages
    });

    var args = {
        collection,
        channelId,
        subChannelKey,
        channelEvents,
    };
    var query = undefined;
    if (isNewChannel) {
        query = queries.createNewChannel({
            ...args,
            additionalChannelProps,
        });
    }
    else {
        if (disableChannelLocking) {
            query = queries.updateAlways({
                ...args,
                lastKnownEventId,
            });
        }
        else {
            query = queries.updateUnlessLocked({
                ...args,
                lastKnownEventId,
                correlationId, // FIXME: not sure if this is still required
            });
        }
    }

    var { insertedId, insertedCount, matchedCount } = await query;
    if (isNewChannel) {
        if (insertedCount < 1) {
            throw new ChannelCreationFailed('could not create channel');
        }
    }
    else {
        if (!matchedCount) {
            throw new ChannelUpdateFailed(
                'channel did not match criteria for update'
            );
        }
    }

    return {
        insertedId,
        lastKnownEventId: nextEventId,
    }
}
