'use strict';
var { prepareStateUpdate } = require('@mpieva/psydb-api-message-handler-lib');
var { StudyConsentTemplate } = require('@mpieva/psydb-schema-creators');

var executeSystemEvents = async (context) => {
    var { message, dispatch, apiConfig } = context;
    var { studyType, subjectType, props } = message.payload;

    var { SET } = prepareStateUpdate({
        schema: StudyConsentTemplate.State({ apiConfig }),
        values: props
    });

    await dispatch({
        collection: 'studyConsentTemplate',
        isNew: true,
        
        extraCreateProps: { studyType, subjectType },
        payload: { $set: SET }
    });
}

module.exports = { executeSystemEvents }
