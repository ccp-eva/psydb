'use strict';
var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var shouldRun = (message) => (
    message.type === 'helperSetItem/patch'
)

var Schema = require('./schema');

var checkSchema = async ({ message }) => {
    var schema = Schema(),
        ajv = Ajv(),
        isValid = ajv.validate(schema, message);

    if (!isValid) {
        throw new ApiError(400, 'InvalidMessageSchema');
    }
}

var checkAllowedAndPlausible = async ({
    db,
    message,
    permissions
}) => {
    var { id, lastKnownEventId, props } = message.payload;
    
    if (!permissions.canCreateHelperSetItem()) {
        throw new ApiError(403);
    }

    console.log(id);
    var existing = await (
        db.collection('helperSetItem').findOne({
            _id: id,
        })
    );
    console.log(existing);

    if (!existing) {
        throw new ApiError(400, 'HelperSetItemNotFound');
    }
}

var triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var { id, lastKnownEventId, props } = payload;

    var channel = (
        rohrpost
        .openCollection('helperSetItem')
        .openChannel({ id })
    );

    await channel.dispatch({ message: {
        type: 'put',
        personnelId,
        payload: {
            prop: '/state/label',
            value: props.label
        }
    }, lastKnownEventId });

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
