'use strict';

var createNewChannel = ({
    collection,
    channelId,
    subChannelKey,
    event
}) => {
    if (subChannelKey) {
        return collection.insertOne({
            _id: channelId,
            [subChannelKey]: {
                events: [ event ]
            }
        });
    }
    else {
        return collection.insertOne({
            _id: channelId,
            events: [ event ]
        });
    }
};

var updateUnlessLocked = ({
    collection,
    channelId,
    subChannelKey,
    correlationId,
    event,
}) => {
    var path = (
        subChannelKey
        ? `${subChannelKey}.events`
        : 'events'
    );
    return collection.updateOne(
        {
            _id: channelId,
            $or: [
                { [`${path}.0.correlationId`]: correlationId },
                { [`${path}.0.processed`]: true }
            ]
        },
        { $push: {
            [path]: {
                $each: [ event ],
                $position: 0,
            },
        }}
    )
};

var updateAlways = ({
    collection,
    channelId,
    event,
}) => {
    var path = (
        subChannelKey
        ? `${subChannelKey}.events`
        : 'events'
    );
    return collection.updateOne(
        {
            _id: channelId,
        },
        { $push: {
            [path]: {
                $each: [ event ],
                $position: 0,
            },
        }}
    )
};

module.exports = {
    createNewChannel,
    updateUnlessLocked,
    updateAlways,
};
