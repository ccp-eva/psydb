'use strict';
var debug = require('debug')('psydb:api:message-handlers');
var { ApiError } = require('@mpieva/psydb-api-lib');

var SimpleHandler = require('../simple-handler');
var createSchema = require('./schema');

var GenericHideRecordHandler = ({ collection }) => {

    var handler = SimpleHandler({
        messageType: `${collection}/hide-record`,
        createSchema,
    });

    handler.checkAllowedAndPlausible = async ({
        db,
        permissions,
        message,
        cache,
    }) => {
        if (!permissions.hasCollectionFlag('subject', 'write')) {
            throw new ApiError(403);
        }

        var { id } = message.payload;

        var record = await (
            db.collection('subject')
            .findOne(
                { _id: id },
                { projection: { _id: true }}
            )
        );
        if (!record) {
            throw new ApiError(404);
        }
    }

    handler.triggerSystemEvents = async (context) => {
        var { message, dispatch } = context;
        var { id } = message.payload;

        await dispatch({
            collection: 'subject',
            channelId: id,
            subChannelKey: 'scientific',
            payload: { $set: {
                'scientific.state.systemPermissions.isHidden': true
            }}
        });
    }

    return handler;
}

module.exports = GenericHideRecordHandler;
