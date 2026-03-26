'use strict';
var { findAndUpdateSequenceNumber } = require('@mpieva/psydb-api-lib');
var { prepareStateUpdate } = require('@mpieva/psydb-api-message-handler-lib');
var { Study, StudyRoadmap } = require('@mpieva/psydb-schema-creators');

var executeSystemEvents = async (context) => {
    var { apiConfig, cache } = context;
    var { dev_enableStudyRoadmap } = apiConfig;
   
    var studyId = await createStudy(context);
    cache.merge({ studyId });
    
    if (dev_enableStudyRoadmap) {
        await createStudyRoadmap(context);
    }
}

var createStudy = async (context) => {
    var { db, dispatch, message, cache, apiConfig } = context;
    var { type, props } = message.payload;
    var { studyCRTSettings: crtSettings } = cache.get();

    var enableInternalProps = true; // FIXME decide what to do with this
    var { SET } = prepareStateUpdate({
        schema: Study.State({ apiConfig, crtSettings, enableInternalProps }),
        values: props
    });

    var sequenceNumber = await findAndUpdateSequenceNumber({
        db, collection: 'study', recordType: type,
    });

    var { channelId } = await dispatch({
        collection: 'study',
        isNew: true,
        
        extraCreateProps: { type, sequenceNumber, isDummy: false },
        payload: { $set: SET }
    });

    return channelId;
}

var createStudyRoadmap = async (ps) => {
    var { db, dispatch, message, cache, apiConfig } = context;
    var { props } = message.payload.studyRoadmap;
    var { studyId } = cache.get();
    
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

module.exports = { executeSystemEvents }
