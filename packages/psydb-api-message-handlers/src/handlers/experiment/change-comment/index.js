'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError, verifyRecordExists } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/change-comment',
    createSchema,
});

handler.checkAllowedAndPlausible = async (context) => {
    var { db, permissions, message } = context;

    var isAllowed = (
        permissions.hasSomeLabOperationFlags({
            types: 'any', flags: [ 'canMoveAndCancelExperiments' ]
        })
    )
    if (!isAllowed) {
        throw new ApiError(403);
    }

    var { experimentId } = message.payload;
    await verifyRecordExists({
        db, collection: 'experiment', recordId: experimentId,
    });
}

handler.triggerSystemEvents = async (context) => {
    var { message, dispatch } = context;
    var { experimentId, comment } = message.payload;

    await dispatch({
        collection: 'experiment',
        channelId: experimentId,
        payload: { $set: {
            'state.comment': comment
        }}
    });
}

module.exports = handler;
