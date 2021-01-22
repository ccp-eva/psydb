'use strict';

var createNewChannel = ({
    collection,
    channelId,
    subChannelKey,
    additionalChannelProps,
    event,
}) => {
    if (subChannelKey) {
        return collection.insertOne({
            _id: channelId,
            ...(additionalChannelProps || {}),
            [subChannelKey]: {
                events: [ event ]
            }
        });
    }
    else {
        return collection.insertOne({
            _id: channelId,
            ...(additionalChannelProps || {}),
            events: [ event ]
        });
    }
};

var updateUnlessLocked = ({
    collection,
    channelId,
    lastKnownMessageId,
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
                { [path]: { $exists: false }},
                {
                    [`${path}.0.processed`]: false,
                    [`${path}.0._id`]: lastKnownMessageId,
                    [`${path}.0.correlationId`]: correlationId,
                },
                {
                    [`${path}.0.processed`]: true,
                    [`${path}.0._id`]: lastKnownMessageId,
                },
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
    lastKnownMessageId,
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
                { [path]: { $exists: false }},
                { [`${path}.0._id`]: lastKnownMessageId },
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

module.exports = {
    createNewChannel,
    updateUnlessLocked,
    updateAlways,
};
