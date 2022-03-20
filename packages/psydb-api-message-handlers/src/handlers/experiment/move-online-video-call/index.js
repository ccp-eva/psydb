'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib');

var {
    checkIntervalHasReservation,
    checkConflictingSubjectExperiments,
    prepareExperimentRecord,
    prepareOpsTeamRecord,
    prepareTargetLocation,
    dispatchAllChannelMessages,
} = require('../util');

var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'experiment/move-online-video-call',
    createSchema,
});

handler.checkAllowedAndPlausible = async (context) => {
    var {
        db,
        permissions,
        cache,
        message
    } = context;

    // TODO
    if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }

    var {
        experimentId,
        experimentOperatorTeamId,
        locationId,
        interval,
    } = message.payload;

    await prepareExperimentRecord(context, {
        experimentType: 'online-video-call',
        experimentId,
    });

    var { experimentRecord } = cache;
    var { studyId } = experimentRecord.state;

    await prepareOpsTeamRecord(context, {
        studyId,
        opsTeamId: experimentOperatorTeamId
    });

    await prepareTargetLocation(context, {
        studyId,
        experimentType: 'online-video-call',
        locationId,
    });
    
    await checkIntervalHasReservation({
        db,
        interval,
        locationId,
        experimentOperatorTeamId: (
            //experimentRecord.state.experimentOperatorTeamId
            experimentOperatorTeamId
        )
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
        loactionId,
        interval,
    } = payload;

    var {
        experimentRecord,
        locationRecord,
    } = cache;

    await dispatch({
        collection: 'experiment',
        channelId: experimentId,
        payload: { $set: {
            'state.experimentOperatorTeamId': experimentOperatorTeamId,
            'state.locationRecordType': locationRecord.type,
            'state.locationId': locationRecord._id,
            'state.interval': interval,
        }}
    });
}

module.exports = handler;
