'use strict';
var ApiError = require('../../../lib/api-error'),
    Ajv = require('../../../lib/ajv');

var createSchema = require('./schema');

var shouldRun = (message) => (
    message.type === 'team-schedule/reserve-slot'
)

var checkSchema = async ({ message }) => {
    var schema = createSchema({ op: 'create' }),
        ajv = Ajv(),
        isValid = ajv.validate(schema, message);

    if (!isValid) {
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
        .openCollection('teamSchedule')
        .openChannel({ id, isNew: true })
    );
    
    await channel.dispatchMany({ messages: [
        {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/experimentOperatorTeamId',
                value: props.experimentOperatorId,
            }
        },
        {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/start',
                value: props.start
            }
        },
        {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/end',
                value: props.end
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
        }
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
