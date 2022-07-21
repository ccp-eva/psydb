'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError, verifyRecordExists } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'location/change-comment',
    createSchema,
});

handler.checkAllowedAndPlausible = async (context) => {
    var { db, permissions, message } = context;

    var isAllowed = (
        permissions.hasFlag('canWriteLocations')
        || permissions.hasLabOperationFlag(
            'away-team', 'canSelectSubjectsForExperiments'
        )
    )
    if (!isAllowed) {
        throw new ApiError(403);
    }

    var { locationId } = message.payload;
    await verifyRecordExists({
        db, collection: 'location', recordId: locationId,
    });
}

handler.triggerSystemEvents = async (context) => {
    var { message, dispatch } = context;
    var { locationId, comment } = message.payload;

    await dispatch({
        collection: 'location',
        channelId: locationId,
        payload: { $set: {
            'state.comment': comment
        }}
    });
}

module.exports = handler;
