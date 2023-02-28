'use strict';
var { keyBy, compareIds } = require('@mpieva/psydb-core-utils');
var generate = require('./generate');

// FIXME fix rohrpost to store allevents in
// topmost _rohrpostmetadaata
var _augmentedGenerate = (bag) => {
    var { orderedEventIds, events, messagesById, omitPaths } = bag;

    var sortedEvents = getSortedEvents(
        events, orderedEventIds
    );

    var history = generate({ events: sortedEvents, omitPaths });
    history = history.map(it => ({
        ...it,
        message: messagesById[it.event.correlationId]
    }));

    return history;
}

var generateChannelHistory = async (bag) => {
    var { db, channelId, omit: omitPaths } = bag;
    var events = await db.collection('rohrpostEvents').find({
        channelId,
    }).toArray();

    if (!(events && events.length > 0)) {
        return [];
    }

    var messages = await db.collection('mqMessageHistory').find({
        _id: { $in: events.map(it => it.correlationId )}
    }).toArray();
    var messagesById = keyBy({ items: messages, byProp: '_id' });

    var { collectionName } = events[0];
    var record = await db.collection(collectionName).findOne({
        _id: channelId
    }, { _rohrpostMetadata: true });

    if (!record) {
        throw new Error(`channel not found ${collection}/${channelId}`);
    }

    var sharedBag = { events, messagesById, omitPaths };

    if (record._rohrpostMetadata.hasSubChannels) {
        return {
            ...(record.scientific && {
                scientific: _augmentedGenerate({
                    ...sharedBag, orderedEventIds: (
                        record.scientific._rohrpostMetadata.eventIds
                    ),
                })
            }),
            ...(record.gdpr && {
                gdpr: _augmentedGenerate({
                    ...sharedBag, orderedEventIds: (
                        record.gdpr._rohrpostMetadata.eventIds
                    ),
                })
            }),
        }
    }
    else {
        return _augmentedGenerate({
            ...sharedBag,
            orderedEventIds: record._rohrpostMetadata.eventIds,
        });
    }
}

var generateChannelVersion = async (bag) => {
    var { db, channelId, eventId } = bag;
    var history = await generateChannelHistory({ db, channelId });

    var item = history.find(historyItem => (
        //historyItem.event._id.equals(eventId)
        compareIds(historyItem.event._id, eventId)
    ));
    return item;
};

var getSortedEvents = (events, order) => {
    var sorted = [];
    for (var orderEventId of order) {
        //var event = events.find(e => e._id.equals(orderEventId))
        var event = events.find(e => compareIds(e._id, orderEventId))
        sorted.push(event);
    }
    return sorted;
}

module.exports = {
    generateChannelHistory,
    generateChannelVersion
};
