'use strict';
var { aggregateOne } = require('@mpieva/psydb-mongo-adapter');
var { prepareStateUpdate } = require('@mpieva/psydb-api-message-handler-lib');
var { StudyRoadmap } = require('@mpieva/psydb-schema-creators');

var handleStudyRoadmap = async (context) => {
    var { db, dispatch, cache } = context;
    var { study } = cache.get();
    
    var existingRoadmap = await aggregateOne({ db, studyRoadmap: {
        studyId: study._id
    }});
    
    if (existingRoadmap) {
        cache.merge({ existingRoadmap });
        await maybePatchStudyRoadmap(context)
    }
    else {
        await createStudyRoadmap(context);
    }
}

var maybePatchStudyRoadmap = async (context) => {
    var { db, dispatch, message, cache } = context;
    var { props } = message.payload.studyRoadmap;
    var { existingRoadmap } = cache.get();
   
    var { _id, state } = existingRoadmap;
    var hasDelta = JSON.stringify(state) !== JSON.stringify(props);
    if (hasDelta) {
        var { SET } = prepareStateUpdate({ values: props });
        
        await dispatch({
            collection: 'studyRoadmap',
            channelId: _id,
            payload: { $set: SET }
        });
    }
}

var createStudyRoadmap = async (context) => {
    var { db, dispatch, message, cache, apiConfig } = context;
    var { props } = message.payload.studyRoadmap;

    var { study } = cache.get();
    var { _id: studyId } = study;
    
    var { SET } = prepareStateUpdate({
        schema: StudyRoadmap.State({ apiConfig }),
        values: props
    });
    
    var { channelId } = await dispatch({
        collection: 'studyRoadmap',
        isNew: true,
        
        extraCreateProps: { studyId },
        payload: { $set: SET }
    });

    return channelId;
}

module.exports = handleStudyRoadmap;
