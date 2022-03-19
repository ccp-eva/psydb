'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var jsonpointer = require('jsonpointer');
var { ApiError, convertPointerToPath } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'custom-record-types/restore-field-definition',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    cache,
    message,
}) => {
    if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }

    var {
        id,
        subChannelKey,
        key
    } = message.payload;

    var existing = await (
        db.collection('customRecordType').find({
            _id: id
        }).toArray()
    );

    if (existing.length < 1) {
        throw new ApiError(404, 'CustomRecordTypeNotFound');
    }

    var fieldsPath = (
        subChannelKey
        ? `/state/settings/subChannelFields/${subChannelKey}`
        : `/state/settings/fields`
    );

    var nextFieldsPointer = (
        subChannelKey
        ? `/state/nextSettings/subChannelFields/${subChannelKey}`
        : `/state/nextSettings/fields`
    );

    var fields = jsonpointer.get(record, fieldsPath);
    var nextFields = jsonpointer.get(record, nextFieldsPointer);

    var isKey = (it) => (it.key === key);
    var fieldIndex = fields.findIndex(isKey);
    var nextFieldIndex = nextFields.findIndex(isKey);

    var field = fields[fieldIndex];
    var nextField = nextFields[nextFieldIndex];

    if (field.isRemoved) {
        if (!nextField.isRemoved) {
            throw new ApiError(400, 'FieldAlreadyMarkedForRestore');
        }        
    }

    cache.nextFieldsPointer = nextFieldsPointer;
    cache.nextFieldIndex = nextFieldIndex;

    // TODO: check if record label definition is still valid

    // TODO: maybe check if every field that is included
    // in the currently fixed settings is equal to the field
    // in next Settings .... on the other hand that shouldnt happen
    // in the first place we should prevent that
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,

    dispatch
}) => {
    var { payload } = message;
    var { id, subChannelKey, key } = payload;
    var {
        nextFieldsPointer,
        nextFieldIndex
    } = cache;

    var path = convertPointerToPath(
        `${nextFieldsPointer}/${nextFieldIndex}`
    );

    dispatch({
        collection: 'customRecordType',
        channelId: id,
        payload: { $set: {
            'state.isDirty': true,
            [`${path}.isDirty`]: true,
            [`${path}.isRemoved`]: false,
        }}
    });
}

module.exports = handler;
