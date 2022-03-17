'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var SimpleHandler = require('../../../lib/simple-handler'),
    PushMaker = require('../../../lib/push-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'study/add-inhouse-test-location-type',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message
}) => {
    // TODO
    if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }

    var {
        id,
        lastKnownEventId,
        customRecordType,
    } = message.payload;

    var study = await (
        db.collection('study')
        .findOne({ _id: id })
    );

    if (!study) {
        throw new ApiError(404, 'StudyNotFound');
    }

    var customRecordTypeRecord = await (
        db.collection('customRecordType')
        .findOne({ type: customRecordType })
    );

    if (!customRecordTypeRecord) {
        throw new ApiError(400, 'InvalidLocationRecordType');
    }

    if (customRecordTypeRecord.collection !== 'location') {
        throw new ApiError(400, 'InvalidLocationRecordType');
    }

    study.state.inhouseTestLocationSettings.forEach(it => {
        if (it.customRecordType === customRecordType) {
            throw new ApiError(400, 'DuplicateLocationRecordType')
        }
    })

}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var { id, lastKnownEventId, customRecordType } = payload;

    var channel = (
        rohrpost
        .openCollection('study')
        .openChannel({
            id,
        })
    );

    var messages = PushMaker({ personnelId }).all({
        // NOTE: this structure has to exist so we can push into the
        // nested arrays
        '/state/inhouseTestLocationSettings': {
            customRecordType,
            enabledLocationIds: [],
        },
    });

    await channel.dispatchMany({ messages, lastKnownEventId });
}

module.exports = handler;
