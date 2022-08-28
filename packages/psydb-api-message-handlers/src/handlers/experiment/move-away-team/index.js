'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError } = require('@mpieva/psydb-api-lib');
var {
    SimpleHandler,
    removeReservationsInInterval, // FIXME: where to put this?
} = require('../../../lib');

var {
    checkIntervalHasReservation,
    checkConflictingLocationExperiments,
    checkConflictingSubjectExperiments,
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
    var isAllowed = permissions.hasLabOperationFlag(
        'away-team', 'canMoveAndCancelExperiments'
    );
    if (!isAllowed) {
        throw new ApiError(403);
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

handler.triggerSystemEvents = async (context) => {
    var { cache, message, dispatch } = context;

    var {
        experimentId,
        experimentOperatorTeamId,
        interval,
        shouldRemoveOldReservation
    } = message.payload;

    var {
        experimentRecord,
    } = cache;

    var {
        interval: oldExperimentInterval,
        experimentOperatorTeamId: oldTeamId,
    } = experimentRecord.state;

    if (shouldRemoveOldReservation) {
        await removeReservationsInInterval({
            ...context,
            removeInterval: oldExperimentInterval,
            extraFilters: {
                'state.experimentOperatorTeamId': oldTeamId,
            }
        });
    }

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
