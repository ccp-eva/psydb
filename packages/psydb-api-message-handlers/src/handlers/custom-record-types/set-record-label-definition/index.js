'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var SimpleHandler = require('../../../lib/simple-handler'),
    PutMaker = require('../../../lib/put-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'custom-record-types/set-record-label-definition',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    cache,
    message
}) => {
    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

    var {
        id,
        lastKnownEventId,
        props,
    } = message.payload;

    var record = await (
        db.collection('customRecordType').findOne({
            _id: id
        })
    );

    if (!record) {
        throw new ApiError(404, 'RecordNotFound');
    }
    
    if (!compareIds(record.events[0]._id, lastKnownEventId)) {
        throw new ApiError(400, 'RecordHasChanged');
    }
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,
}) => {
    var { personnelId, payload } = message;
    var {
        id,
        lastKnownEventId,
        props
    } = payload;

    var channel = (
        rohrpost
        .openCollection('customRecordType')
        .openChannel({
            id
        })
    );

    var messages = PutMaker({ personnelId }).all({
        '/state/nextSettings/recordLabelDefinition': {
            isDirty: true,
            ...props
        }
    });

    await channel.dispatchMany({
        lastKnownEventId,
        messages,
    });
}

module.exports = handler;
