'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var {
    checkLocationExists,
    checkAllSubjectsExist,
    checkAllSubjectGroupsExist,
    checkConflictingLocationReservations,
    checkConflictingSubjectExperiments,

    dispatchAllChannelMessages,
} = require('../util');

var createSchema = require('./schema');

var shouldRun = (message) => (
    message.type === 'experiment/create-from-awayteam-reservation'
)

var checkSchema = async ({ message }) => {
    var schema = createSchema(),
        ajv = Ajv(),
        isValid = ajv.validate(schema, message);

    if (!isValid) {
        debug(message.type, ajv.errors);
        throw new ApiError(400, 'InvalidMessageSchema');
    }
}

var checkAllowedAndPlausible = async ({
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

    await checkLocationExists({
        db,
        locationId,
    })

    await checkConflictingLocationReservations({
        db, locationId, interval: reservation.state.interval
    });

    await checkAllSubjectGroupsExist({
        db, subjectGroupIds,
    });

    await checkAllSubjectsExist({
        db, subjectIds,
    });

    await checkConflictingSubjectExperiments({
        db, subjectIds, interval: reservation.state.interval
    });
}

var triggerSystemEvents = async ({
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
        interval: reservation.state.interval,

        locationId: props.locationId,
        subjectGroupIds: props.subjectGroupIds,
        subjectIds: props.subjectIds,

        lastKnownReservationEventId: props.lastKnownReservationEventId,
    });
}

// no-op
var triggerOtherSideEffects = async () => {};

module.exports = {
    shouldRun,
    checkSchema,
    checkAllowedAndPlausible,
    triggerSystemEvents,
    triggerOtherSideEffects,
}
