'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError } = require('@mpieva/psydb-api-lib/src/api-error');
var { SimpleHandler } = require('../../../lib');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experimentOperatorTeam/set-visibility',
    createSchema
});

handler.checkAllowedAndPlausible = async (context) => {
    var {
        db,
        permissions,
        cache,
        message
    } = context;

    if (!permissions.hasFlag('canWriteStudies')) {
        throw new ApiError(403);
    }

    var {
        experimentOperatorTeamId,
    } = message.payload;

    var record = await db.collection('experimentOperatorTeam').findOne({
        _id: experimentOperatorTeamId
    });
    if (!record) {
        throw new ApiError(400, {
            apiStatus: 'InvalidExperimentOperatorTeamId'
        });
    }
}

handler.triggerSystemEvents = async (context) => {
    var { message, dispatch } = context;
    var { experimentOperatorTeamId, isVisible } = message.payload;

    await dispatch({
        collection: 'experimentOperatorTeam',
        channelId: experimentOperatorTeamId,
        payload: { $set: {
            'state.hidden': !isVisible
        }}
    })
}

module.exports = handler;
