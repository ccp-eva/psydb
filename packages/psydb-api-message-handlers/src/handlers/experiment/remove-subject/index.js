'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var SimpleHandler = require('../../../lib/simple-handler'),
    checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var PutMaker = require('../../../lib/put-maker'),
    PushMaker = require('../../../lib/push-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/remove-subject',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    cache,
    message
}) => {
    // TODO
    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

    var {
        experimentId,
        lastKnownExperimentEventId,
        subjectId,
        lastKnownSubjectScientificEventId,

        unparticipateStatus,
        //experimentComment,
        subjectComment,
        blockSubjectFromTesting,
    } = message.payload;

    var experimentRecord = cache.experimentRecord = await (
        db.collection('experiment').findOne({
            _id: experimentId
        })
    );

    if (!experimentRecord) {
        throw new ApiError(400, 'InvalidExperimentId');
    }
    /*if (!compareIds(experimentRecord.events[0]._id, lastKnownExperimentEventId)) {
        throw new ApiError(400, 'ExperimentRecordHasChanged');
    }*/

    var {
        selectedSubjectIds,
        subjectData
    } = experimentRecord.state;

    var selectedSubjectIdsIndex = undefined;
    for (var [index, it] of selectedSubjectIds.entries()) {
        if (compareIds(it, subjectId)) {
            selectedSubjectIdsIndex = index;
        }
    }
    if (selectedSubjectIdsIndex === undefined) {
        throw new ApiError(400, 'InvalidSubjectId');
    }

    var subjectDataIndex = undefined;
    for (var [index, it] of subjectData.entries()) {
        if (
            compareIds(it.subjectId, subjectId)
            && it.participationStatus === 'unknown'
        ) {
            subjectDataIndex = index;
        }
    }
    if (subjectDataIndex === undefined) {
        throw new ApiError(400, 'InvalidSubjectId');
    }

    var subjectRecord = cache.subjectRecord = await (
        db.collection('subject').findOne({
            _id: subjectId
        })
    );

    if (!subjectRecord) {
        throw new ApiError(400, 'InvalidSubjectId');
    }
    /*if (!compareIds(subjectRecord.scientific.events[0]._id, lastKnownSubjectScientificEventId)) {
        throw new ApiError(400, 'SubjectRecordHasChanged');
    }*/

    var {
        invitedForExperiments
    } = subjectRecord.scientific.state.internals;

    var subjectInvitationIndex = undefined;
    for (var [index, it] of invitedForExperiments.entries()) {
        if (compareIds(it.experimentId, experimentId)) {
            subjectInvitationIndex = index;
        }
    }
    if (subjectInvitationIndex === undefined) {
        throw new ApiError(400, 'InvalidSubjectId'); // FIXME: status?
    }

    cache.selectedSubjectIdsIndex = selectedSubjectIdsIndex;
    cache.subjectDataIndex = subjectDataIndex;
    cache.subjectInvitationIndex = subjectInvitationIndex;
}

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
        //lastKnownExperimentEventId,
        subjectId,
        //lastKnownSubjectScientificEventId,

        unparticipateStatus,
        //experimentComment,
        subjectComment,
        blockSubjectFromTesting,
    } = payload;

    var {
        experimentRecord,
        subjectRecord,
        subjectDataIndex,
    } = cache;

    var canceledSubjectCount = 1; // because we will cancel one now
    for (var it of experimentRecord.state.subjectData) {
        var isSubjectCanceled = (
            [
                'canceled-by-participant',
                'canceled-by-institute',
                'deleted-by-institute'
            ].includes(it.participationStatus)
        );
        if (isSubjectCanceled) {
            canceledSubjectCount += 1;
        }
    }

    var shouldCancelExperiment = (
        experimentRecord.state.subjectData.length === canceledSubjectCount
    );

    var experimentChannel = (
        rohrpost.openCollection('experiment').openChannel({
            id: experimentId
        })
    )

    // FIXME
    var lastKnownExperimentEventId = experimentRecord.events[0]._id;

    var ePath = `/state/subjectData/${subjectDataIndex}`;
    await experimentChannel.dispatchMany({
        lastKnownEventId: lastKnownExperimentEventId,
        messages: [
            ...PutMaker({ personnelId }).all({
                [`${ePath}/participationStatus`]: unparticipateStatus,
                ...(shouldCancelExperiment && {
                    '/state/isCanceled': true
                }),
            })
        ]
    })

    var shouldUpdateSubjectComment = (
        subjectRecord.scientific.state.comment !== subjectComment
    );

    var subjectChannel = (
        rohrpost.openCollection('subject').openChannel({
            id: subjectId
        })
    )

    /// FIXME
    var lastKnownSubjectScientificEventId = subjectRecord.scientific.events[0]._id;

    await subjectChannel.dispatchMany({
        subChannelKey: 'scientific',
        lastKnownEventId: lastKnownSubjectScientificEventId,
        messages: [
            ...PushMaker({ personnelId }).all({
                '/state/internals/participatedInStudies': {
                    type: 'experiment',
                    studyId: experimentRecord.state.studyId,
                    timestamp: experimentRecord.state.interval.start,
                    status: unparticipateStatus,
                }
            }),
            ...(
                shouldUpdateSubjectComment
                ? PutMaker({ personnelId }).all({
                    '/state/comment': subjectComment,
                })
                : []
            ),
            ...(
                blockSubjectFromTesting.shouldBlock === true
                ? PutMaker({ personnelId }).all({
                    '/state/internals/blockedFromTesting': {
                        isBlocked: true,
                        blockUntil: blockSubjectFromTesting.blockUntil
                    },
                })
                : []
            )
        ]
    })

}

module.exports = handler;
