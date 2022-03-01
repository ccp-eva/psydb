'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
    fetchRecordReverseRefs,
} = require('@mpieva/psydb-api-lib');

var SimpleHandler = require('../../../lib/simple-handler');
var PutMaker = require('../../../lib/put-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'personnel/remove',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache,
}) => {
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    var {
        id,
        lastKnownSubChannelEventIds,
    } = message.payload;

    var record = await (
        db.collection('personnel')
        .findOne(
            { _id: id },
            { projection: {
                'scientific.events': false,
                'gdpr.events': false
            }}
        )
    );
    if (!record) {
        throw new ApiError(404);
    }

    var reverseRefs = await fetchRecordReverseRefs({
        db,
        recordId: id,
        refTargetCollection: 'personnel'
    });

    if (reverseRefs.length > 0) {
        throw new ApiError(409, {
            apiStatus: 'RecordHasReverseRefs',
            data: { reverseRefs }
        });
    }

}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
    cache,
}) => {
    var {
        id,
        lastKnownSubChannelEventIds,
    } = message.payload;

    var channel = (
        rohrpost
        .openCollection('personnel')
        .openChannel({ id })
    );

    await channel.dispatchMany({
        lastKnownEventId: (
            lastKnownSubChannelEventIds.scientific
        ),
        subChannelKey: 'scientific',
        messages: PutMaker({ personnelId }).all({
            '/state/internals/isRemoved': true
        })
    })
}


module.exports = handler;
