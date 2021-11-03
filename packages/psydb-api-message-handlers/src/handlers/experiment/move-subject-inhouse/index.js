'use strict';
var debug = require('debug')('psydb:api:message-handlers');
var nanoid = require('nanoid').nanoid;

var compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../lib/simple-handler'),
    checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var {
    checkIntervalHasReservation,
    checkConflictingSubjectExperiments,
    dispatchCreateEvents,
    dispatchAddSubjectEvents,
    dispatchRemoveSubjectEvents,

    prepareExperimentRecord,
    prepareSubjectRecord,
    prepareOpsTeamRecord,
    prepareLocationRecord,

    verifySubjectMovable,
} = require('../util');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/move-subject-inhouse',
    createSchema,
});

handler.checkAllowedAndPlausible = async (context) => {
    var {
        db,
        permissions,
        cache,
        message
    } = context

    // TODO
    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

    var targetCache = cache.targetCache = {};

    var {
        experimentId,
        subjectId,
        target
    } = message.payload;

    await prepareExperimentRecord(context, {
        experimentType: 'inhouse',
        experimentId,
    });
   
    await prepareSubjectRecord(context, {
        subjectId,
    });

    var { experimentRecord } = cache;
    var { studyId } = experimentRecord.state;

    /*var subjectExistsInSource = (
        experimentRecord.state.subjectData.find(it => (
            compareIds(it.subjectId, subjectId)
        ))
    )
    if (!subjectExistsInSource) {
        throw new ApiError(400, 'SubjectMissingInSource');
    }*/

    var targetContext = {
        db,
        cache: targetCache,
    };
    if (target.experimentId) {
        await prepareExperimentRecord(targetContext, {
            experimentType: 'inhouse',
            experimentId: target.experimentId,
        });

        await verifySubjectMovable(context, {
            subjectId,
            sourceExperimentRecord: experimentRecord,
            targetExperimentRecord: targetCache.experimentRecord
        });
    }
    else {
        await prepareLocationRecord(targetContext, {
            locationId: target.locationId,
        });
        await prepareOpsTeamRecord(targetContext, {
            opsTeamId: target.experimentOperatorTeamId,
            studyId,
        });


        /*var targetLocationRecord = targetCache.locationRecord = await (
            db.collection('location').findOne({
                _id: target.locationId
            })
        );
        if (!targetLocationRecord) {
            throw new ApiError(400, 'InvalidTargetLocationId');
        }

        var targetTeamRecord = targetCache.teamRecord = await (
            db.collection('experimentOperatorTeam').findOne({
                _id: target.experimentOperatorTeamId
            })
        );
        if (!targetTeamRecord) {
            throw new ApiError(400, 'InvalidTargetTeamId');
        }

        await checkIntervalHasReservation({
            db,
            interval: target.interval,
            locationId: target.locationId,
            experimentOperatorTeamId: target.experimentOperatorTeamId
        });

        await checkConflictingSubjectExperiments({
            db, subjectIds: [ subjectId ], interval: target.interval
        });*/
    }
};

handler.triggerSystemEvents = async ({
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

        var [ experimentMod, subjectMod ] = rohrpost.getModifiedChannels();
        var lastKnownSubjectScientificEventId = (
            subjectMod
            ? subjectMod.lastKnownEventId
            : subjectRecord.scientific.events[0]._id
        );
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
            lastKnownSubjectScientificEventId,
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

        var [ experimentMod, subjectMod ] = rohrpost.getModifiedChannels();
        // FIXME: this unlocks the specific channel so i can dispatch
        // more stuff into that thing ... im not happy with that
        await db.collection('subject').updateOne(
            { _id: subjectId },
            { $set: {
                'scientific.events.$[].processed': true,
            }},
        );


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

module.exports = handler;
