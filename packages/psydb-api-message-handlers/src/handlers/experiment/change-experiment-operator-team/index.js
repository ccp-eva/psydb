'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
    createId,
    compareIds,
    checkIntervalHasReservation,
} = require('@mpieva/psydb-api-lib');

var {
    SimpleHandler,
    removeReservationsInInterval, // FIXME: where to put this?
} = require('../../../lib/');

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
    if (experimentRecord.state.experimentOperatorIds?.length) {
        throw new ApiError(409, 'PostprocessingAlreadyStarted');
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

handler.triggerSystemEvents = async (context) => {
    var { db, cache, message, dispatch, dispatchProps } = context;

    var {
        experimentId,
        experimentOperatorTeamId: newTeamId,
        shouldRemoveOldReservation
    } = message.payload;

    var {
        experimentRecord,
        teamRecord,
    } = cache;

    var { 
        type, state: {
            studyId,
            locationId,
            locationRecordType,
            experimentOperatorTeamId: oldTeamId,
            interval: experimentInterval,
        }
    } = experimentRecord;

    var reservationType = (
        type === 'away-team' ? 'awayTeam' : 'inhouse'
    );

    if (reservationType === 'inhouse' || shouldRemoveOldReservation) {
        var extraFilters = {
            'state.experimentOperatorTeamId': oldTeamId,
            ...(reservationType === 'inhouse' && {
                'state.locationId': locationId,
            })
        }

        await removeReservationsInInterval({
            ...context,
            removeInterval: experimentInterval,
            extraFilters
        });
    }
    
    var hasReservation = await checkIntervalHasReservation({
        db,
        interval: experimentInterval,
        experimentOperatorTeamId: newTeamId,
        ...(reservationType === 'inhouse' && {
            locationId,
        }),
    });

    if (!hasReservation) {
        await dispatchProps({
            collection: 'reservation',
            isNew: true,
            additionalChannelProps: {
                type: reservationType
            },
            props: {
                seriesId: await createId(), //FIXME: why?
                isDeleted: false,
                studyId,
                experimentOperatorTeamId: newTeamId,
                interval: experimentInterval,
                ...(reservationType === 'inhouse' && {
                    locationId,
                    locationRecordType
                })
            },

            initialize: true,
            recordType: reservationType,
        });
    }

    await dispatch({
        collection: 'experiment',
        channelId: experimentId,
        payload: { $set: {
            'state.experimentOperatorTeamId': newTeamId,
        }}
    });
}

module.exports = handler;
