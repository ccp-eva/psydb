'use strict';
var { prepareStateUpdate } = require('@mpieva/psydb-api-message-handler-lib');
var { StudyEmailMetaTemplate } = require('@mpieva/psydb-schema-creators');

var executeSystemEvents = async (context) => {
    var { message, dispatch, apiConfig } = context;
    var { studyType, subjectType, props } = message.payload;

    var { SET } = prepareStateUpdate({
        schema: StudyEmailMetaTemplate.State({ apiConfig }),
        values: props
    });

    await dispatch({
        collection: 'studyEmailMetaTemplate',
        isNew: true,
        
        extraCreateProps: { studyType, subjectType },
        payload: { $set: SET }
    });
}

module.exports = { executeSystemEvents }
