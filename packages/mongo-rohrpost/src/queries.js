'use strict';

var createNewChannel = ({
    collection,
    channelId,
    subChannelKey,
    additionalChannelProps,
    channelEvents,
}) => {
    if (subChannelKey) {
        return collection.insertOne({
            _id: channelId,
            ...(additionalChannelProps || {}),
            [subChannelKey]: {
                events: channelEvents
            }
        });
    }
    else {
        return collection.insertOne({
            _id: channelId,
            ...(additionalChannelProps || {}),
            events: channelEvents
        });
    }
};

var updateUnlessLocked = async ({
    collection,
    channelId,
    lastKnownEventId,
    subChannelKey,
    correlationId,
    channelEvents,
    disableLastEventIdCheck,
}) => {
    var path = (
        subChannelKey
        ? `${subChannelKey}.events`
        : 'events'
    );
    
    var filter = undefined;
    if (disableLastEventIdCheck) {
        filter = {
            _id: channelId,
            $or: [
                { [path]: { $exists: false }},
                { [`${path}.0.processed`]: true },
            ]
        };
    }
    else {
        lastKnownEventId = _handleMongoNullIssue(lastKnownEventId);
        filter = {
            _id: channelId,
            $or: [
                { [path]: { $exists: false }},
                {
                    [`${path}.0.processed`]: true,
                    [`${path}.0._id`]: lastKnownEventId
                }
            ]
        };
    }

    return await collection.updateOne(
        /*{
            _id: channelId,
            $or: [
                { [path]: { $exists: false }},
                {
                    [`${path}.0.processed`]: false,
                    [`${path}.0._id`]: lastKnownEventId,
                    [`${path}.0.correlationId`]: correlationId,
                },
                {
                    [`${path}.0.processed`]: true,
                    [`${path}.0._id`]: lastKnownEventId
                },
            ]
        },*/
        filter,
        { $push: {
            [path]: {
                $each: channelEvents,
                $position: 0,
            },
        }}
    );

};

var updateAlways = ({
    collection,
    channelId,
    lastKnownEventId,
    channelEvents,
    disableLastEventIdCheck,
}) => {
    var path = (
        subChannelKey
        ? `${subChannelKey}.events`
        : 'events'
    );
    
    var filter = undefined;
    if (disableLastEventIdCheck) {
        filter = {
            _id: channelId
        };
    }
    else {
        lastKnownEventId = _handleMongoNullIssue(lastKnownEventId);
        filter = {
            _id: channelId,
            $or: [
                { [path]: { $exists: false }},
                { [`${path}.0._id`]: lastKnownEventId },
            ]
        };
    }

    return collection.updateOne(
        filter,
        { $push: {
            [path]: {
                $each: channelEvents,
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
