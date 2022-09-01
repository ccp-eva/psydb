'use strict';
var debug = require('debug')('psydb:api:message-handlers');
var { createId } = require('@mpieva/psydb-api-lib');

var {
    dispatchCreateEvents,
    dispatchAddSubjectEvents,
    dispatchRemoveSubjectEvents,
} = require('../util');

var triggerSystemEvents = async (context) => {
    var { db, cache, message } = context;
    var { type: messageType, payload } = message;
    var {
        experimentId,
        target,
        subjectId,
        comment = '',
        autoConfirm = false,
    } = payload;

    var {
        experimentRecord,
        subjectRecord,
        targetCache
    } = cache;

    if (target.experimentId) {
        await dispatchAddSubjectEvents({
            ...context,
            experimentRecord: targetCache.experimentRecord,            
            subjectRecord,
        });
    }
    else {
        //var { reservation } = cache;
        var locationRecord = await db.collection('location').findOne({
            _id: target.locationId,
        }, { projection: { type: true }});

        await dispatchCreateEvents({
            ...context,

            type: 'online-video-call',
            // FIXME: id format; fixme when study uses follow up
            // appointments we need to reuse the original id when
            // this is not the first appointment of this child in
            // this study
            seriesId: await createId(),
            studyId: experimentRecord.state.studyId,
            experimentOperatorTeamId: target.experimentOperatorTeamId,
            locationId: locationRecord._id,
            locationRecordType: locationRecord.type,
            interval: target.interval,
            subjectData: [
                { subjectId: subjectRecord._id, comment, autoConfirm },
            ]
        });

    }
}

module.exports = triggerSystemEvents;
