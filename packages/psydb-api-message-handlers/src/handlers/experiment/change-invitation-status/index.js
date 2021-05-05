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
    messageType: 'experiment/change-invitation-status',
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
        invitationStatus,
    } = message.payload;

    var experimentRecord = cache.experimentRecord = await (
        db.collection('experiment').findOne({
            _id: experimentId
        })
    );

    if (!experimentRecord) {
        throw new ApiError('InvalidExperimentId');
    }

    var subjectRecord = cache.subjectRecord = await (
        db.collection('subject').findOne({
            _id: subjectId
        })
    )

    if (!subjectRecord) {
        throw new ApiError('InvalidSubjectId');
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
        invitationStatus
    } = payload;

    var {
        experimentRecord,
        subjectRecord,
    } = cache;

    var experimentInvitationIndex = (
        experimentRecord.state.subjectData.findIndex(it => {
            return compareIds(it.subjectId, subjectId)
        })
    )

    var subjectInvitationIndex = (
        subjectRecord.scientific.state.internals.invitedForExperiments
        .findIndex(it => {
            return compareIds(it.experimentId, experimentId)
        })
    )

    var experimentInvitationStatusPath = (
        `/state/subjectData/${experimentInvitationIndex}/invitationStatus`
    );

    var subjectInvitationStatusPath = (
        `/state/internals/invitedForExperiments/${subjectInvitationIndex}/status`
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
                [experimentInvitationStatusPath]: invitationStatus
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
                [subjectInvitationStatusPath]: invitationStatus
            })
        ]
    })
}

module.exports = handler;
