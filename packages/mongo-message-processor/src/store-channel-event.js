'use strict';

var storeChannelEvent = async ({
    db,
    rohrpostKey,
    channelId,
    isNewChannel,

    id,
    timestamp,

    correlationId,
    message
}) => {
    var event = {
        _id: id,
        timestamp,
        correlationId,
        message,
        processed: false,
    };

    if (isNewChannel) {
        await (
            db
            .collection(rohrpostKey)
            .insertOne({
                _id: channelId,
                events: [ event ]
            })
        );
    }
    else {
        await (
            db
            .collection(rohrpostKey)
            .updateOne(
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
                }},
                { upsert: true }
            )
        )
    }
}

