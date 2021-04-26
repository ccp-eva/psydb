'use strict';
var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var createSchema = require('./create-schema'),
    parseMessageType = require('./parse-message-type');

var shouldRun = (message) => (
    message.type === 'helper-set-items/create'
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
    message,
    permissions
}) => {
    var { set, id } = message.payload;
    
    if (!permissions.canCreateHelperSetItem()) {
        throw new ApiError(403);
    }

    var existingSet = await (
        db.collection('helperSet').findOne({
            _id: set,
        })
    );

    if (!existingSet) {
        // InvalidHelperSet
        throw new ApiError(400);
    }

    var existingByKey = await (
        db.collection('helperSetItems').findOne({
            key: id,
        })
    );

    if (existingByKey) {
        throw new ApiError(400);
    }

    /*if (op === 'patch') {
        var stored = await (
            db.collection('helperSetItem').findOne({
                _id: payload.id,
                'state.set': set
            })
        );
        if (!stored) {
            // ImplausibleValue
            throw new ApiError(400);
        }
    }*/
}

var triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var { id, set, props } = payload;

    var channel = (
        rohrpost
        .openCollection('helperSetItem')
        .openChannel({
            additionalChannelProps: { key: id, set }
        })
    );

    await channel.dispatch({ message: {
        type: 'put',
        personnelId,
        payload: {
            prop: '/state/label',
            value: props.label
        }
    }});

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
