'use strict';
var executeSystemEvents = async (context) => {
    var { db, dispatch, message, now } = context;
    var { _id } = message.payload;

    var nonDuplicateRefs = await (
        db.collection('subject').find(
            { 'scientific.state.internals.nonDuplicateIds': _id },
            { projection: { _id: true }}
        ).toArray()
    );
    for (var it of nonDuplicateRefs) {
        await dispatch({
            collection: 'subject', channelId: it._id,
            subChannelKey: 'scientific',
            payload: { $pull: {
                'scientific.state.internals.nonDuplicateIds': _id
            }}
        });
    }

    await dispatch.makeMrproperMultiplexed({
        collection: 'subject', channelIds: [ _id ], now
    });
}

module.exports = { executeSystemEvents }
