'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
    mongoEscapeDeep,
} = require('@mpieva/psydb-api-lib');

var {
    SimpleHandler,
    removeReservationsInInterval, // FIXME: where to put this?
} = require('../../../lib');

var {
    checkIntervalHasReservation,
    checkConflictingSubjectExperiments,
    prepareExperimentRecord,
    prepareOpsTeamRecord,
    prepareTargetLocation,
    resetSubjectInviteStatus,
} = require('../util');

var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'experiment/move-inhouse',
    createSchema,
});

handler.checkAllowedAndPlausible = async (context) => {
    var {
        db,
        permissions,
        cache,
        message
    } = context;

    var isAllowed = permissions.hasLabOperationFlag(
        'inhouse', 'canMoveAndCancelExperiments'
    );
    if (!isAllowed) {
        throw new ApiError(403);
    }

    var {
        experimentId,
        experimentOperatorTeamId,
        locationId,
        interval,
    } = message.payload;

    await prepareExperimentRecord(context, {
        experimentType: 'inhouse',
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
        experimentType: 'inhouse',
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

handler.triggerSystemEvents = async (context) => {
    var { cache, message, dispatch, rohrpost, personnelId } = context;

    var {
        experimentId,
        experimentOperatorTeamId,
        loactionId,
        interval,
        shouldRemoveOldReservation
    } = message.payload;

    var {
        experimentRecord,
        locationRecord,
    } = cache;

    var {
        interval: oldExperimentInterval,
        experimentOperatorTeamId: oldTeamId,
        locationId: oldLocationId,
        subjectData: oldSubjectData,
        studyId,
    } = experimentRecord.state;

    if (shouldRemoveOldReservation) {
        await removeReservationsInInterval({
            ...context,
            removeInterval: oldExperimentInterval,
            extraFilters: {
                'state.experimentOperatorTeamId': oldTeamId,
                'state.locationId': oldLocationId,
            }
        });
    }

    var newSubjectData = oldSubjectData.map(it => ({
        ...it,
        invitationStatus: 'scheduled'
    }));

    await dispatch({
        collection: 'experiment',
        channelId: experimentId,
        payload: { $set: {
            'state.experimentOperatorTeamId': experimentOperatorTeamId,
            'state.locationRecordType': locationRecord.type,
            'state.locationId': locationRecord._id,
            'state.interval': interval,
            'state.subjectData': newSubjectData,
        }}
    });

    await resetSubjectInviteStatus({
        rohrpost,
        experimentId,
        experimentType: 'inhouse',
        studyId,
        personnelId,
        subjectIds: oldSubjectData.map(it => it.subjectId)
    });
}


module.exports = handler;
