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

var updateUnlessLocked = async ({
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
    
    lastKnownMessageId = _handleMongoNullIssue(lastKnownMessageId);

    return await collection.updateOne(
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
    );

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

    lastKnownMessageId = _handleMongoNullIssue(lastKnownMessageId);
    
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

// FIXME: there is some unexpected behavior when using querying
// arr.0.myfield : null/undefined which finds documents even if
// the specified field is non-null see:
// https://stackoverflow.com/q/45818633/1158560
var _handleMongoNullIssue = (maybeNullOrUndefined) => (
    maybeNullOrUndefined === null || maybeNullOrUndefined === undefined
    ? { type: 10 }
    : maybeNullOrUndefined
)

module.exports = {
    createNewChannel,
    updateUnlessLocked,
    updateAlways,
};
