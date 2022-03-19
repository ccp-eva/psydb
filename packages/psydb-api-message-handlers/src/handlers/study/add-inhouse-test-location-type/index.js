'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib');

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

    dispatch,
}) => {
    var { type: messageType, payload } = message;
    var { id, customRecordType } = payload;

    await dispatch({
        collection: 'study',
        channelId: id,
        payload: { $push: {
            'state.inhouseTestLocationSettings': {
                customRecordType,
                enabledLocationIds: [],
            },
        }}
    });
}

module.exports = handler;
