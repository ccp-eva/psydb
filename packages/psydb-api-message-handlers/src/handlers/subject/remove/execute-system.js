'use strict';
var executeSystemEvents = async (context) => {
    var { dispatch, message, now } = context;
    var { _id } = message.payload;

    await dispatch.makeMrproperMultiplexed({
        collection: 'subject', channelIds: [ _id ], now
    });
}

module.exports = { executeSystemEvents }
