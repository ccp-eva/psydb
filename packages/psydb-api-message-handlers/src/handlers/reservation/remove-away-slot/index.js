'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var SimpleHandler = require('../../../lib/simple-handler');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'reservation/remove-awayteam-slot',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message
}) => {
    var canRemove = permissions.hasSomeLabOperationFlags({
        types: ['away-team'],
        flags: ['canWriteReservations']
    });
    if (!canRemove) {
        throw new ApiError(403);
    }
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var { id } = payload.props;

    await db.collection('reservation').removeMany({
        _id: id
    });

}

module.exports = handler;
