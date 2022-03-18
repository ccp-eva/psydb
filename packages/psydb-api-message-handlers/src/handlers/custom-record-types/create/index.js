'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var deepmerge = require('deepmerge');
var {
    ApiError,
    createInitialChannelState
} = require('@mpieva/psydb-api-lib');

var SimpleHandler = require('../../../lib/simple-handler'),
    PutMaker = require('../../../lib/put-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'custom-record-types/create',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message
}) => {
    if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }

    var {
        collection,
        type,
    } = message.payload;

    var existing = await (
        db.collection('customRecordType').find({
            collection,
            type
        }).toArray()
    );

    if (existing.length > 0) {
        throw new ApiError(400, 'DuplicateCustomRecordType');
    }
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,

    dispatchProps,
}) => {
    var { id, collection, type, props } = message.payload;

    var defaults = await createInitialChannelState({
        db,
        collection: 'customRecordType',
        additionalSchemaCreatorArgs: { collection }
    });

    await dispatchProps({
        collection: 'customRecordType',
        channelId: id,
        isNew: true,
        additionalChannelProps: { collection, type },
        props: deepmerge(
            defaults.state,
            props
        )
    });
}

module.exports = handler;
