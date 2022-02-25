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

    var self = await (
        db.collection('personnel')
        .findOne({ _id: personnelId }, { projection: {
            'gdpr.state.internals.passwordHash': true,
        }})
    );
    var passwordHash = self.gdpr.state.internals.passwordHash;

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
    } = context;
    
    var { newPassword } = message.payload;
    var newPasswordHash = bcrypt.hashSync(newPassword, 10);

    var self = await (
        db.collection('personnel')
        .findOne({ _id: personnelId })
    );

    var channel = (
        rohrpost
        .openCollection('personnel')
        .openChannel({
            id: personnelId
        })
    )

    await channel.dispatchMany({
        lastKnownEventId: self.gdpr.events[0]._id,
        subChannelKey: 'gdpr',
        messages: PutMaker({ personnelId }).all({
            '/state/internals/passwordHash': newPasswordHash
        })
    })
}

module.exports = handler;
