'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var enums = require('@mpieva/psydb-schema-enums');
var compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var PutMaker = require('../../../lib/put-maker'),
    PushMaker = require('../../../lib/push-maker');

var dispatchRemoveSubjectEvents = async ({
    db,
    rohrpost,
    personnelId,

    experimentRecord,
    subjectRecord,

    unparticipateStatus,
    subjectComment,
    blockSubjectFromTesting
}) => {
    
    var subjectDataIndex = undefined;
    for (var [index, it] of experimentRecord.state.subjectData.entries()) {
        if (
            compareIds(it.subjectId, subjectRecord._id)
            && it.participationStatus === 'unknown'
        ) {
            subjectDataIndex = index;
        }
    }

    var canceledSubjectCount = 1; // because we will cancel one now
    for (var it of experimentRecord.state.subjectData) {
        var isSubjectCanceled = (
            enums.unparticipationStatus.keys.includes(
                it.participationStatus
            )
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
            id: experimentRecord._id
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
            id: subjectRecord._id
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
                    type: 'inhouse',
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

module.exports = dispatchRemoveSubjectEvents;
