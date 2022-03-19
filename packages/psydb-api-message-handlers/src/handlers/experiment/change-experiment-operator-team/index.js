'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError, compareIds } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/change-experiment-operator-team',
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
        experimentOperatorTeamId,
    } = message.payload;

    var experimentRecord = cache.experimentRecord = await (
        db.collection('experiment').findOne({
            _id: experimentId
        })
    );

    if (!experimentRecord) {
        throw new ApiError(400, 'InvalidExperimentId');
    }

    var teamRecord = cache.teamRecord = await (
        db.collection('experimentOperatorTeam').findOne({
            _id: experimentOperatorTeamId,
            studyId: experimentRecord.state.studyId,
        })
    )

    if (!teamRecord) {
        throw new ApiError(400, 'InvalidTeamId');
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
        experimentOperatorTeamId,
    } = payload;

    var {
        experimentRecord,
        teamRecord,
    } = cache;

    await dispatch({
        collection: 'experiment',
        channelId: experimentId,
        payload: { $set: {
            'state.experimentOperatorTeamId': experimentOperatorTeamId,
        }}
    });
}

module.exports = handler;
