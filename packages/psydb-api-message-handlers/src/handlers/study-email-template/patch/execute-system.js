'use strict';
var { prepareStateUpdate } = require('@mpieva/psydb-api-message-handler-lib');

var executeSystemEvents = async (context) => {
    var { message, dispatch } = context;
    var { _id: studyEmailTemplateId, props } = message.payload;

    var { SET } = prepareStateUpdate({ values: props });
    
    await dispatch({
        collection: 'studyEmailTemplate',
        channelId: studyEmailTemplateId,
        payload: { $set: SET }
    });
}

module.exports = { executeSystemEvents }
