'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var SimpleHandler = require('../../../lib/simple-handler'),
    checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var PutMaker = require('../../../lib/put-maker'),
    PushMaker = require('../../../lib/push-maker');

var {
    dispatchRemoveSubjectEvents,
} = require('../util');

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
        //throw new ApiError(403);
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

    if (experimentRecord.type === 'inhouse') {
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
        
        cache.subjectInvitationIndex = subjectInvitationIndex;
    }

    cache.selectedSubjectIdsIndex = selectedSubjectIdsIndex;
    cache.subjectDataIndex = subjectDataIndex;
}

handler.triggerSystemEvents = async (context) => {
    var {
        db,
        rohrpost,
        cache,
        message,
        personnelId,
    } = context;

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
    } = cache;

    await dispatchRemoveSubjectEvents({
        ...context,

        experimentRecord,
        subjectRecord,

        unparticipateStatus,
        subjectComment,
        blockSubjectFromTesting,

        dontTrackSubjectParticipatedInStudies: (
            unparticipateStatus === 'deleted'
        )
    });
}

module.exports = handler;
