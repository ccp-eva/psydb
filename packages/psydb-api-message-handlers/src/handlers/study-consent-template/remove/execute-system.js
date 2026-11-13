'use strict';

var executeSystemEvents = async (context) => {
    var { message, dispatch, now } = context;
    var { studyConsentTemplateId } = message.payload;

    await dispatch.makeMrproperMultiplexed({
        collection: 'studyConsentTemplate', channelIds: [ studyConsentTemplateId ], now
    });
}

module.exports = { executeSystemEvents }
