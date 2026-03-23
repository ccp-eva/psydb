'use strict';

var executeSystemEvents = async (context) => {
    var { db, dispatch, message } = context;
    var { _id } = message.payload;

    await dispatch.makeClean({
        collection: 'subject',
        channelId: _id, subChannelKey: 'gdpr',
    });
}

module.exports = { executeSystemEvents }
