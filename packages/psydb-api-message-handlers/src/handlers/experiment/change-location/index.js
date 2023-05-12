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
    messageType: 'experiment/change-location',
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
        locationId,
    } = message.payload;

    var experimentRecord = cache.experimentRecord = await (
        db.collection('experiment').findOne({
            _id: experimentId,
        })
    );
    if (!experimentRecord) {
        throw new ApiError(400, 'InvalidExperimentId');
    }
    // FIXME: can non invite experiment locations even be changed?
    if (experimentRecord.type === 'away-team') {
        throw new ApiError(400, 'InvalidExperimentType');
    }

    var locationRecord = cache.locationRecord = await (
        db.collection('location').findOne({
            _id: locationId,
        })
    )

    if (!locationRecord) {
        throw new ApiError(400, 'InvalidLocationId');
    }
}

handler.triggerSystemEvents = async (context) => {
    var { db, cache, message, dispatch, dispatchProps } = context;

    var {
        experimentId,
        locationId: newLocationId,
    } = message.payload;

    var {
        experimentRecord,
        locationRecord,
    } = cache;

    var { type: newLocationRecordType } = locationRecord;

    var { 
        type, state: {
            studyId,
            locationId: oldLocationId,
            experimentOperatorTeamId,
            interval: experimentInterval,
        }
    } = experimentRecord;

    var reservationType = (
        type === 'away-team' ? 'awayTeam' : 'inhouse'
    );

    if (reservationType === 'inhouse') {
        await removeReservationsInInterval({
            ...context,
            removeInterval: experimentInterval,
            extraFilters: {
                'state.locationId': oldLocationId,
            }
        });
    
        var hasReservation = await checkIntervalHasReservation({
            db,
            interval: experimentInterval,
            experimentOperatorTeamId,
            locationId: newLocationId,
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
                    experimentOperatorTeamId,
                    interval: experimentInterval,
                    locationId: newLocationId,
                    locationRecordType: newLocationRecordType
                },

                initialize: true,
                recordType: reservationType,
            });
        }
    }

    await dispatch({
        collection: 'experiment',
        channelId: experimentId,
        payload: { $set: {
            'state.locationId': newLocationId,
            'state.locationRecordType': newLocationRecordType
        }}
    });
}

module.exports = handler;
