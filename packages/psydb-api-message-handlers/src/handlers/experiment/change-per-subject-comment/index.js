'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError, compareIds } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/change-per-subject-comment',
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
        comment,
    } = message.payload;

    var experimentRecord = cache.experimentRecord = await (
        db.collection('experiment').findOne({
            _id: experimentId
        })
    );

    if (!experimentRecord) {
        throw new ApiError(400, 'InvalidExperimentId');
    }

    var subjectDataIndex = (
        experimentRecord.state.subjectData.findIndex(it => {
            return compareIds(it.subjectId, subjectId)
        })
    );
    if (subjectDataIndex === undefined) {
        throw new ApiError(400, 'InvalidSubjectId');
    }

    cache.subjectDataIndex = subjectDataIndex;
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
        comment
    } = payload;

    var {
        experimentRecord,
        subjectDataIndex,
    } = cache;

    var path = `state.subjectData.${subjectDataIndex}.comment`;
    await dispatch({
        collection: 'experiment',
        channelId: experimentId,
        payload: { $set: {
            [path]: comment
        }}
    });
}

module.exports = handler;
