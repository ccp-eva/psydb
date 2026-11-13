'use strict';

var executeSystemEvents = async (context) => {
    var { message, dispatch, now } = context;
    var { studyConsentFormId } = message.payload;

    await dispatch.makeMrproperMultiplexed({
        collection: 'studyConsentForm', channelIds: [ studyConsentFormId ], now
    });
}

module.exports = { executeSystemEvents }
