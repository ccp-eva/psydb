'use strict';
var debug = require('debug')('psydb:api:message-handlers');
var { nanoid } = require('nanoid');

var {
    dispatchCreateEvents,
    dispatchAddSubjectEvents,
    dispatchRemoveSubjectEvents,
} = require('../util');

var triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,
    personnelId,
}) => {
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

        // FIXME: this unlocks the specific channel so i can dispatch
        // more stuff into that thing ... im not happy with that
        await db.collection('subject').updateOne(
            { _id: subjectId },
            { $set: {
                'scientific.events.$[].processed': true,
            }},
        );

        var subjectRecord = await (
            db.collection('subject').findOne({
                _id: subjectId
            })
        );

        await dispatchAddSubjectEvents({
            db,
            rohrpost,
            personnelId,

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
