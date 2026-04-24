'use strict';
var executeSystemEvents = async (context) => {
    var { dispatch, message, cache, now } = context;
    var { _id: csvImportId } = message.payload;
    var { subjectIds } = cache.get();

    if (subjectIds.length > 0) {
        await dispatch.makeMrproperMultiplexed({
            collection: 'subject', channelIds: subjectIds, now
        });
    }

    await dispatch.makeMrproperMultiplexed({
        collection: 'csvImport', channelIds: [ csvImportId ], now
    });
}

module.exports = { executeSystemEvents }
