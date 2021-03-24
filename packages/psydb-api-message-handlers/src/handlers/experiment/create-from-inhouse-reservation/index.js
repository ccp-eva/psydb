'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../lib/simple-handler'),
    createPuts = require('../../../lib/create-puts'),
    checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var {
    checkConflictingSubjectExperiments,
    dispatchAllChannelMessages,
} = require('../util');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/create-from-inhouse-reservation',
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
        throw new ApiError(403);
    }

    var {
        reservationId,
        lastKnownReservationEventId,
        subjectGroupIds,
        subjectIds,
    } = message.payload.props;

    var reservation = cache.reservation = await (
        db.collection('reservation')
        .findOne(
            { _id: reservationId },
        )
    );

    if (!reservation) {
        throw new ApiError(400, 'InvalidReservation');
    }
    if (reservation.state.hasExperiment === true) {
        throw new ApiError(400, 'ReservationHasExperiment');
    }
    if (reservation.events[0]._id !== lastKnownReservationEventId) {
        throw new ApiError(400, 'ReservationHasChanged');
    }

    // TODO: use FK to check existance (?)
    await checkForeignIdsExist(db, {
        'subjectGroup': subjectGroupIds,
        'subject': subjectIds
    });

    await checkConflictingSubjectExperiments({
        db, subjectIds, interval: reservation.state.interval
    });
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var { id, props } = payload;

    var { reservation } = cache;

    await dispatchAllChannelMessages({
        db,
        rohrpost,
        personnelId,

        forcedExperimentId: id,

        reservationId: reservation._id,
        seriesId: reservation.state.seriesId,
        studyId: reservation.state.studyId,
        experimentOperatorTeamId: reservation.state.experimentOperatorTeamId,
        locationId: reservation.state.locationId,
        interval: reservation.state.interval,

        subjectGroupIds: props.subjectGroupIds,
        subjectIds: props.subjectIds,

        lastKnownReservationEventId: props.lastKnownReservationEventId,
    });
}

module.exports = handler;
