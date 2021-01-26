'use strict';

var createNewChannel = ({
    collection,
    channelId,
    subChannelKey,
    additionalChannelProps,
    channelEvent,
}) => {
    if (subChannelKey) {
        return collection.insertOne({
            _id: channelId,
            ...(additionalChannelProps || {}),
            [subChannelKey]: {
                events: [ channelEvent ]
            }
        });
    }
    else {
        return collection.insertOne({
            _id: channelId,
            ...(additionalChannelProps || {}),
            events: [ channelEvent ]
        });
    }
};

var updateUnlessLocked = ({
    collection,
    channelId,
    lastKnownMessageId,
    subChannelKey,
    correlationId,
    channelEvent,
}) => {
    var path = (
        subChannelKey
        ? `${subChannelKey}.events`
        : 'events'
    );
    // FIXME: for some reason lastKnownMessageId == undefined
    // is treated as if it matches any 0._id field
    if (!lastKnownMessageId) {
        throw new Error('lastKnownMessageId must be provided when updating and existing channel');
    }
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
                $each: [ channelEvent ],
                $position: 0,
            },
        }}
    )
};

var updateAlways = ({
    collection,
    channelId,
    lastKnownMessageId,
    channelEvent,
}) => {
    var path = (
        subChannelKey
        ? `${subChannelKey}.events`
        : 'events'
    );

    // FIXME: for some reason lastKnownMessageId == undefined
    // is treated as if it matches any 0._id field
    if (!lastKnownMessageId) {
        throw new Error('lastKnownMessageId must be provided when updating and existing channel');
    }
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
                $each: [ channelEvent ],
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
