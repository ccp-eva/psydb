'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../lib/simple-handler'),
    PutMaker = require('../../../lib/put-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'custom-record-types/enable-date-of-birth-field',
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
    
    cache.record = records[0];
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,
}) => {
    var { personnelId, payload } = message;
    var { id, lastKnownEventId } = payload;

    var channel = (
        rohrpost
        .openCollection('customRecordType')
        .openChannel({
            id
        })
    );

    var messages = PutMaker({ personnelId }).all({
        '/state/nextSettings/dateOfBirthField/isDirty': true,
        '/state/nextSettings/dateOfBirthField/isEnabled': true,
    });

    await channel.dispatchMany({
        lastKnownEventId,
        messages,
    });
}

module.exports = handler;
