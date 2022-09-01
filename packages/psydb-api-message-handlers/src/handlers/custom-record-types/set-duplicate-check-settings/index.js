'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    convertCRTRecordToSettings,
    CRTSettings
} = require('@mpieva/psydb-common-lib');

var { ApiError } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'custom-record-types/set-duplicate-check-settings',
    createSchema,
});

handler.checkAllowedAndPlausible = async (context) => {
    var {
        db,
        permissions,
        message
    } = context;

    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    var {
        id,
        fieldSettings,
    } = message.payload;

    var record = await (
        db.collection('customRecordType').findOne({ _id: id })
    );
    if (!record) {
        throw new ApiError(404, 'CustomRecordTypeNotFound');
    }

    var crtSettings = convertCRTRecordToSettings(record);
    var crt = CRTSettings({ data: crtSettings });

    var receivedPointers = fieldSettings.map(it => it.pointer);
    var intersected = (
        crt.findCustomFields({
            type: { $in: [
                'SaneString', 'DateOnlyServerSide', 'BiologicalGender'
            ]},
            pointer: { $in: receivedPointers }
        })
    );
    if (intersected.length !== receivedPointers.length) {
        throw new ApiError(409, 'FieldConflict');
    }
}

handler.triggerSystemEvents = async (context) => {
    var {
        db,
        message,
        dispatch,
    } = context;

    var { payload } = message;
    var { id, fieldSettings } = payload;

    await dispatch({
        collection: 'customRecordType',
        channelId: id,
        payload: { $set: {
            'state.duplicateCheckSettings': {
                fieldSettings
            }
        }}
    });
}

module.exports = handler;
