'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
} = require('@mpieva/psydb-api-lib');

var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'apiKey/remove',
    createSchema,
});

handler.checkAllowedAndPlausible = async (context) => {
    var { db, permissions, message } = context;

    if (!permissions.hasCollectionFlag('apiKey', 'remove')) {
        throw new ApiError(403);
    }

    var { id } = message.payload;

    var record = await (
        db.collection('apiKey')
        .findOne({ _id: id })
    );
    if (!record) {
        throw new ApiError(404);
    }
}

handler.triggerSystemEvents = async (context) => {
    var { message, dispatch } = context;
    var { id } = message.payload;

    await dispatch({
        collection: 'apiKey',
        channelId: id,
        payload: { $set: {
            'state.internals.isRemoved': true
        }}
    });
}


module.exports = handler;
