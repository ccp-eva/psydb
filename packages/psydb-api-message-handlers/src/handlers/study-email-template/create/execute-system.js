'use strict';
var { prepareStateUpdate } = require('@mpieva/psydb-api-message-handler-lib');
var { StudyEmailTemplate } = require('@mpieva/psydb-schema-creators');

var executeSystemEvents = async (context) => {
    var { message, dispatch, apiConfig } = context;
    var { studyId, subjectType, props } = message.payload;

    var { SET } = prepareStateUpdate({
        schema: StudyEmailTemplate.State({ apiConfig }),
        values: props
    });

    await dispatch({
        collection: 'studyEmailTemplate',
        isNew: true,
        
        extraCreateProps: { studyId, subjectType },
        payload: { $set: SET }
    });
}

module.exports = { executeSystemEvents }
