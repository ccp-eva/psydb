'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');
var { ApiError } = require('@mpieva/psydb-api-lib');

var SimpleHandler = require('../simple-handler');
var createSchema = require('./schema');

var GenericUnhideRecordHandler = ({ collection }) => {

    var collectionCreatorData = allSchemaCreators[collection];
    if (!collectionCreatorData) {
        throw new Error('InvalidCollection');
    }
    
    var { hasSubChannels } = collectionCreatorData;

    var handler = SimpleHandler({
        messageType: `${collection}/unhide-record`,
        createSchema,
    });

    handler.checkAllowedAndPlausible = async ({
        db,
        permissions,
        message,
        cache,
    }) => {
        if (!permissions.hasCollectionFlag(collection, 'write')) {
            throw new ApiError(403);
        }

        var { id } = message.payload;

        var record = await (
            db.collection(collection)
            .findOne(
                { _id: id },
                { projection: { _id: true }}
            )
        );
        if (!record) {
            throw new ApiError(404);
        }
    }

    var path = (
        hasSubChannels
        ? 'scientific.state.systemPermissions.isHidden'
        : 'state.systemPermissions.isHidden'
    )

    handler.triggerSystemEvents = async (context) => {
        var { message, dispatch } = context;
        var { id } = message.payload;

        await dispatch({
            collection: collection,
            channelId: id,
            ...(hasSubChannels && {
                subChannelKey: 'scientific'
            }),
            payload: { $set: {
                [path]: false
            }}
        });
    }

    return handler;
}

module.exports = GenericUnhideRecordHandler;
