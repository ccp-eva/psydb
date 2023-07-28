'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var enums = require('@mpieva/psydb-schema-enums');
var { compareIds } = require('@mpieva/psydb-core-utils');
var { createId } = require('@mpieva/psydb-api-lib');

var dispatchRemoveSubjectEvents = async ({
    db,
    dispatch,

    experimentRecord,
    subjectRecord,

    unparticipateStatus,
    subjectComment,
    blockSubjectFromTesting,

    dontTrackSubjectParticipatedInStudies,
}) => {
    
    var study = await db.collection('study').findOne({
        _id: experimentRecord.state.studyId
    });
    
    var { experimentOperatorIds } = experimentRecord.state;
    if (!(experimentOperatorIds?.length)) {
        var labTeam = await db.collection('experimentOperatorTeam').findOne({
            _id: experimentRecord.state.experimentOperatorTeamId
        });
        experimentOperatorIds = labTeam.state.personnelIds;
    }

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

    var ePath = `/state/subjectData/${subjectDataIndex}`;
    await dispatch({
        collection: 'experiment',
        channelId: experimentRecord._id,
        payload: {
            $pull: {
                'state.selectedSubjectIds': subjectRecord._id,
                'state.subjectData': { subjectId: subjectRecord._id }
            },
            ...(shouldCancelExperiment && {
                $set: { 'state.isCanceled': true }
            })
        }
    });
    

    var shouldUpdateSubjectComment = (
        subjectComment !== undefined
        && subjectRecord.scientific.state.comment !== subjectComment
    );

    var {
        invitedForExperiments,
    } = subjectRecord.scientific.state.internals;

    var oldInviteIndex = invitedForExperiments.findIndex(it => (
        compareIds(it.experimentId, experimentRecord._id)
    ));

    var pushUpdates = {
        ...(!dontTrackSubjectParticipatedInStudies && {
            'scientific.state.internals.participatedInStudies': {
                _id: await createId(),
                experimentId: experimentRecord._id,
                type: experimentRecord.type,
                studyId: experimentRecord.state.studyId,
                studyType: study.type,
                locationId: experimentRecord.state.locationId,
                locationType: experimentRecord.state.locationRecordType,
                timestamp: experimentRecord.state.interval.start,
                experimentOperatorIds,
                excludeFromMoreExperimentsInStudy: false, // FIXME

                status: unparticipateStatus,
            }
        })
    };

    var setUpdates = {
        ...(shouldUpdateSubjectComment && {
            'scientific.state.comment': subjectComment,
        }),
        // FIXME: not sure if blocking is even a thing anymore
        ...(blockSubjectFromTesting.shouldBlock === true && {
            'scientific.state.internals.blockedFromTesting': {
                isBlocked: true,
                blockUntil: blockSubjectFromTesting.blockUntil
            },
        }),
    }

    var ipath = (
        `scientific.state.internals.invitedForExperiments.${oldInviteIndex}`
    )
    var unsetUpdates = {
        [ipath]: true
    }

    await dispatch({
        collection: 'subject',
        channelId: subjectRecord._id,
        subChannelKey: 'scientific',
        payload: {
            ...(hasKeys(pushUpdates) && { $push: pushUpdates }),
            ...(hasKeys(setUpdates) && { $set: setUpdates }),
            $unset: unsetUpdates
        }
    })

    // FIXME: his is a workaround for:
    // http://jira.mongodb.org/browse/SERVER-1014
    await dispatch({
        collection: 'subject',
        channelId: subjectRecord._id,
        subChannelKey: 'scientific',
        payload: { $pull: {
            'scientific.state.internals.invitedForExperiments': null
        }}
    });
}

var hasKeys = (o) => Object.keys(o).length > 0;

module.exports = dispatchRemoveSubjectEvents;
