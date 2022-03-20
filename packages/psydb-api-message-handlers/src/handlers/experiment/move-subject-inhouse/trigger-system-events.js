'use strict';
var debug = require('debug')('psydb:api:message-handlers');
var { nanoid } = require('nanoid');

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

        await dispatchRemoveSubjectEvents({
            ...context,

            experimentRecord,
            subjectRecord,

            unparticipateStatus: 'moved',
            subjectComment: undefined,
            blockSubjectFromTesting: { shouldBlock: false },

            dontTrackSubjectParticipatedInStudies : true,
        });

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

        await dispatchRemoveSubjectEvents({
            db,
            rohrpost,
            personnelId,

            experimentRecord,
            subjectRecord,

            unparticipateStatus: 'moved',
            subjectComment: undefined,
            blockSubjectFromTesting: { shouldBlock: false },
            
            dontTrackSubjectParticipatedInStudies : true,
        });

        await dispatchCreateEvents({
            db,
            rohrpost,
            personnelId,

            type: 'inhouse',
            // FIXME: id format; fixme when study uses follow up
            // appointments we need to reuse the original id when
            // this is not the first appointment of this child in
            // this study
            seriesId: nanoid(),
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
