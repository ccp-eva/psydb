'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib');

var {
    checkIntervalHasReservation,
    checkConflictingLocationExperiments,
    checkConflictingSubjectExperiments,
    dispatchAllChannelMessages,
} = require('../util');

var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'experiment/move-away-team',
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
        interval,
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
        throw new ApiError(400, 'InvalidExperimentOperatorTeamId');
    }

    await checkIntervalHasReservation({
        db,
        interval,
        experimentOperatorTeamId: (
            //experimentRecord.state.experimentOperatorTeamId
            experimentOperatorTeamId
        )
    });

    await checkConflictingLocationExperiments({
        db,
        locationId: experimentRecord.state.locationId,
        interval,
    });

    // FIXME: i think this be done but only when the interval is outside of
    // the original
    /*await checkConflictingSubjectExperiments({
        db,
        interval,
        subjectIds: experimentOperatorTeam.stat.selectedSubjectIds,
    });*/
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
        interval,
    } = payload;

    var {
        experimentRecord,
    } = cache;

    await dispatch({
        collection: 'experiment',
        channelId: experimentId,
        payload: { $set: {
            'state.experimentOperatorTeamId': experimentOperatorTeamId,
            'state.interval': interval,
        }}
    });
}

module.exports = handler;
