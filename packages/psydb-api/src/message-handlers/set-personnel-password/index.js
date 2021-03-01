'use strict';
var brypt = require('bcrypt'),
    messageType = require('./message-type'),
    checkSchema = require('./check-schema');

var shouldRun = (message) => (
    messageType === message.type
)

// throw 400 or 403
var checkAllowedAndPlausible = async ({
    db,
    message,
    permissions,
}) => {
    var personnelRecord = await (
        db.collection('personnel').findOne({ _id: message.payload.id })
    );

    if (!personnelRecord) {
        throw new ApiError(400);
    }

    if (!permissions.canPatchRecord(personnelRecord)) {
        throw new ApiError(403);
    }
};

var triggerSystemEvents = async ({
    db,
    rohrpost,
    message
}) => {
    var { type: messageType, personnelId, payload } = message;
    var { id: targetRecordId, lastKnownEventId, password } = payload;

    var channel = (
        rohrpost
        .openCollection('personnel')
        .openChannel({ id: targetRecordId })
    );

    var passwordHash = brypt.hashSync(password, 10);
    await channel.dispatch({
        subChannelKey: 'gdpr',
        lastKnownEventId,
        message: {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/internals/passwordHash',
                value: passwordHash
            }
        }
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
};
