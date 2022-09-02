'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var bcrypt = require('bcrypt');
var { ApiError } = require('@mpieva/psydb-api-lib');
var { SimpleHandler, PutMaker } = require('../../../lib/');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'self/set-password',
    createSchema,
});

handler.checkAllowedAndPlausible = async (context) => {
    var {
        db,
        personnelId,
        message,
        cache,
    } = context;

    var { currentPassword } = message.payload;

    var shadow = await (
        db.collection('personnelShadow')
        .findOne({ _id: personnelId }, { projection: {
            'passwordHash': true,
        }})
    );
    var { passwordHash } = shadow;

    if (bcrypt.compareSync(currentPassword, passwordHash)) {
        debug('passwords match');
    }
    else {
        throw new ApiError(400, 'PasswordMismatch');
    }
}

handler.triggerSystemEvents = async (context) => {
    var {
        db,
        rohrpost,
        message,
        personnelId,
        dispatch,
    } = context;
    
    var { newPassword } = message.payload;
    var newPasswordHash = bcrypt.hashSync(newPassword, 10);

    await db.collection('personnelShadow').updateOne(
        { _id: personnelId },
        { $set: {
            setAt: now,
            setBy: personnelId,
            passwordHash: newPasswordHash,
        }},
        { upsert: true }
    );

    await dispatch({
        collection: 'personnel',
        channelId: personnelId,
        subChannelKey: 'gdpr',
        payload: { $set: {
            'gdpr.state.internals.lastPasswordChange': now,
        }}
    });
}

module.exports = handler;
