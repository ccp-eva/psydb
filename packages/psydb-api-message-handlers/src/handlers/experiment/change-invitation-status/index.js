'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError, compareIds } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib/');
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
        //throw new ApiError(403);
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
    dispatch,
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

    var eix = (
        experimentRecord.state.subjectData.findIndex(it => {
            return compareIds(it.subjectId, subjectId)
        })
    );

    await dispatch({
        collection: 'experiment',
        channelId: experimentId,
        payload: { $set: {
            [`state.subjectData.${eix}.invitationStatus`]: invitationStatus
        }}
    });

    var six = (
        subjectRecord.scientific.state.internals.invitedForExperiments
        .findIndex(it => {
            return compareIds(it.experimentId, experimentId)
        })
    )

    var spath = (
        `scientific.state.internals.invitedForExperiments.${six}.status`
    );
    await dispatch({
        collection: 'subject',
        channelId: subjectId,
        subChannelKey: 'scientific',
        payload: { $set: {
            [spath]: invitationStatus
        }}
    });
}

module.exports = handler;
