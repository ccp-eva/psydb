'use strict';
var { prepareStateUpdate } = require('@mpieva/psydb-api-message-handler-lib');
var { Study, StudyRoadmap } = require('@mpieva/psydb-schema-creators');

var maybeOverrideNullEnd = require('./maybe-override-null-end');

var executeSystemEvents = async (context) => {
    var { db, message, dispatch, cache } = context;
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
}

module.exports = { executeSystemEvents }
