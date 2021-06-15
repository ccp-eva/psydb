'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../lib/simple-handler'),
    checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var {
    checkConflictingLocationReservations,
    checkConflictingSubjectExperiments,
    dispatchCreateEvents,
} = require('../util');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/create-from-awayteam-reservation',
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
        locationId,
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
        'location': locationId,
        //'subjectGroup': subjectGroupIds,
        'subject': subjectIds
    });

    await checkConflictingLocationReservations({
        db, locationId, interval: reservation.state.interval
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

    var locationRecord = await (
        db.collection('location').findOne({ _id: props.locationId })
    );

    await dispatchCreateEvents({
        db,
        rohrpost,
        personnelId,

        forcedExperimentId: id,

        type: 'away-team',
        reservationId: reservation._id,
        seriesId: reservation.state.seriesId,
        studyId: reservation.state.studyId,
        experimentOperatorTeamId: reservation.state.experimentOperatorTeamId,
        interval: reservation.state.interval,

        locationId: props.locationId,
        locationRecordType: locationRecord.type,
        //subjectGroupIds: props.subjectGroupIds,
        subjectIds: props.subjectIds,

        lastKnownReservationEventId: props.lastKnownReservationEventId,
    });
}

module.exports = handler;
