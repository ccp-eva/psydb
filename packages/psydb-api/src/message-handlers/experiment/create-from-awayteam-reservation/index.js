'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('../../../lib/api-error'),
    Ajv = require('../../../lib/ajv');

var {
    checkStudyExists,
    checkExperimentOperatorTeamExists,
    checkConflictingTeamReservations,
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
        subjects,
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

    checkLocationExists({
        db,
        locationId,
    })

    checkConflictingLocationReservations({
        db, locationId, interval
    });

    checkAllSubjectsExist({
        db, subjectIds,
    });

    checkConflictingSubjectExperiments({
        db, subjectIds, interval: reservation.interval
    });
}

var triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var { id, props } = payload;

    var channel = (
        rohrpost
        .openCollection('reservation')
        .openChannel({
            id,
            isNew: true,
            additionalChannelProps: {
                type: 'awayTeam'
            }
        })
    );
    
    await channel.dispatchMany({ messages: [
        {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/seriesId',
                value: nanoid() // FIXME
            }
        },
        // FIXME: not sure about this deleted thing
        {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/isDeleted',
                value: false
            }
        },
        {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/studyId',
                value: props.studyId,
            }
        },
        {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/experimentOperatorTeamId',
                value: props.experimentOperatorTeamId,
            }
        },
        {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/interval/start',
                value: props.interval.start
            }
        },
        {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/interval/end',
                value: props.interval.end
            }
        },
    ]})
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
