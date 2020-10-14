'use strict';

var createNewChannel = ({
    collection,
    channelId,
    event
}) => (
    collection.insertOne({
        _id: channelId,
        events: [ event ]
    })
);

var updateUnlessLocked = ({
    collection,
    channelId,
    correlationId,
    event,
}) => (
    collection.updateOne(
        {
            _id: channelId,
            $or: [
                { 'events.0.correlationId': correlationId },
                { 'events.0.processed': true }
            ]
        },
        { $push: {
            events: {
                $each: [ event ],
                $position: 0,
            },
        }}
    )
);

var updateAlways = ({
    collection,
    channelId,
    event,
}) => (
    collection.updateOne(
        {
            _id: channelId,
        },
        { $push: {
            events: {
                $each: [ event ],
                $position: 0,
            },
        }}
    )
);

module.exports = {
    createNewChannel,
    updateUnlessLocked,
    updateAlways,
};
