'use strict';
// TODO: redesign this to gtet the whole conditions object
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var SimpleHandler = require('../../../lib/simple-handler'),
    PutMaker = require('../../../lib/put-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'study/update-inhouse-test-location-type-settings',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache,
}) => {
    // TODO
    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

    var {
        id,
        lastKnownEventId,
        customRecordType,
        props,
    } = message.payload;

    var {
        ageFrame,
        conditions,
    } = props;

    var study = await (
        db.collection('study')
        .findOne({ _id: id })
    );

    if (!study) {
        throw new ApiError(404, 'StudyNotFound');
    }

    if (!compareIds(study.events[0]._id, lastKnownEventId)) {
        throw new ApiError(400, 'RecordHasChanged');
    }

    var { inhouseTestLocationSettings } = study.state;

    var settingsIndex = undefined;
    for (var [index, it] of inhouseTestLocationSettings.entries()) {
        if (it.customRecordType === customRecordType) {
            settingsIndex = index;
            break;
        }
    }

    if (settingsIndex === undefined) {
        throw new ApiError(400, 'InvalidLocationRecordType');
    }
    
    cache.settingsIndex = settingsIndex;
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
    cache,
}) => {
    var { type: messageType, payload } = message;
    var { 
        id,
        lastKnownEventId,
        customRecordType,
        props,
    } = payload;

    var {
        enabledLocationIds,
    } = props;

    var channel = (
        rohrpost
        .openCollection('study')
        .openChannel({
            id,
        })
    );

    var si = cache.settingsIndex;
    var base = `/state/inhouseTestLocationSettings/${si}`;

    var messages = PutMaker({ personnelId }).all({
        [`${base}/enabledLocationIds`]: enabledLocationIds,
    });

    await channel.dispatchMany({ messages, lastKnownEventId });
}

module.exports = handler;
