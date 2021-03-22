'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('../../../lib/api-error'),
    Ajv = require('../../../lib/ajv');

var {
    checkStudyExists,
    checkExperimentOperatorTeamExists,
    checkLocationExists,

    checkConflictingTeamReservations,
    checkConflictingLocationReservations,
} = require('../util');

var createSchema = require('./schema');

var shouldRun = (message) => (
    message.type === 'reservation/reserve-inhouse-slot'
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
    message
}) => {
    // TODO
    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

    var {
        studyId,
        experimentOperatorTeamId,
        locationId,
        interval,
    } = message.payload.props;

    // TODO: use FK to check existance
    await checkStudyExists({
        db,
        studyId
    });
    
    // TODO: use FK to check existance
    await checkExperimentOperatorTeamExists({
        db,
        experimentOperatorTeamId
    });

    // TODO: use FK to check existance
    await checkLocationExists({
        db,
        locationId
    });

    await checkConflictingTeamReservations({
        db, experimentOperatorTeamId, interval
    });
    
    await checkConflictingLocationReservations({
        db, locationId, interval
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
                type: 'inhouse'
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
                prop: '/state/locationId',
                value: props.locationId,
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
