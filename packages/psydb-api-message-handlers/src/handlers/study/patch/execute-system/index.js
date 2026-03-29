'use strict';
var { prepareStateUpdate } = require('@mpieva/psydb-api-message-handler-lib');

var maybeOverrideNullEnd = require('./maybe-override-null-end');
var handleStudyRoadmap = require('./handle-study-roadmap');

var executeSystemEvents = async (context) => {
    var { db, message, dispatch, cache, apiConfig } = context;
    
    var { dev_enableStudyRoadmap } = apiConfig;
    var { _id: studyId, props } = message.payload;
    var { study } = cache.get();

    await maybeOverrideNullEnd(context);

    var { SET } = prepareStateUpdate({
        values: props
    });

    await dispatch({
        collection: 'study',
        channelId: studyId,
        payload: { $set: SET }
    });

    if (dev_enableStudyRoadmap) {
        await handleStudyRoadmap(context);
    }
}

module.exports = { executeSystemEvents }
