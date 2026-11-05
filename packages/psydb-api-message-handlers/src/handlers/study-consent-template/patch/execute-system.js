'use strict';
var { prepareStateUpdate } = require('@mpieva/psydb-api-message-handler-lib');

var executeSystemEvents = async (context) => {
    var { message, dispatch } = context;
    var { studyConsentTemplateId, props, } = message.payload;

    var { SET } = prepareStateUpdate({ values: props });
    
    await dispatch({
        collection: 'studyConsentTemplate',
        channelId: studyConsentTemplateId,
        payload: { $set: SET }
    });
}

module.exports = { executeSystemEvents }
