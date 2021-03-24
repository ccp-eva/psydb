'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

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
        props,
    } = message.payload;

    var records = await (
        db.collection('customRecordType').find({
            _id: id
        }).toArray()
    );

    if (records.length < 1) {
        throw new ApiError(404, 'CustomRecordTypeNotFound');
    }
    
    var record = cache.record = records[0];
    cache.lastKnownEventId = record.events[0]._id;

    // TODO: to make the checks we need to create
    // a default state object of the related record collection

    var { format, tokens } = props;
    // TODO: check tokens agains nextFields
    // TODO: check format placeholders against token count
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,
}) => {
    var { personnelId, payload } = message;
    var { id, props } = payload;
    var { lastKnownEventId } = cache;

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
