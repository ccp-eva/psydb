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
    messageType: 'experiment/change-participation-status',
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
        subjectId,
        participationStatus,
    } = message.payload;

    var experimentRecord = cache.experimentRecord = await (
        db.collection('experiment').findOne({
            _id: experimentId
        })
    );

    if (!experimentRecord) {
        throw new ApiError(400, 'InvalidExperimentId');
    }

    var subjectRecord = cache.subjectRecord = await (
        db.collection('subject').findOne({
            _id: subjectId
        })
    )

    if (!subjectRecord) {
        throw new ApiError(400, 'InvalidSubjectId');
    }
    
    var subjectDataIndex = (
        experimentRecord.state.subjectData.findIndex(it => {
            return compareIds(it.subjectId, subjectId)
        })
    );
    if (subjectDataIndex === undefined) {
        throw new ApiError(400, 'InvalidSubjectId');
    }

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
        subjectId,
        participationStatus
    } = payload;

    var {
        experimentRecord,
        subjectRecord,
    } = cache;

    var experimentParticipationIndex = (
        experimentRecord.state.subjectData.findIndex(it => {
            return compareIds(it.subjectId, subjectId)
        })
    )

    var subjectParticipationIndex = (
        subjectRecord.scientific.state.internals.invitedForExperiments
        .findIndex(it => {
            return compareIds(it.experimentId, experimentId)
        })
    )

    var experimentParticipationStatusPath = (
        `/state/subjectData/${experimentParticipationIndex}/participationStatus`
    );

    var subjectParticipationStatusPath = (
        `/state/internals/invitedForExperiments/${subjectParticipationIndex}/status`
    );

    var experimentChannel = (
        rohrpost.openCollection('experiment').openChannel({
            id: experimentId
        })
    )

    await experimentChannel.dispatchMany({
        lastKnownEventId: experimentRecord.events[0]._id,
        messages: [
            ...PutMaker({ personnelId }).all({
                [experimentParticipationStatusPath]: participationStatus
            })
        ]
    })

    var subjectChannel = (
        rohrpost.openCollection('subject').openChannel({
            id: subjectId
        })
    )

    await subjectChannel.dispatchMany({
        subChannelKey: 'scientific',
        lastKnownEventId: subjectRecord.scientific.events[0]._id,
        messages: [
            ...PutMaker({ personnelId }).all({
                [subjectParticipationStatusPath]: participationStatus
            })
        ]
    })
}

module.exports = handler;
