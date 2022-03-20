'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var jsonpointer = require('jsonpointer');
var { ApiError, convertPointerToPath } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'custom-record-types/remove-field-definition',
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

    var record = await (
        db.collection('customRecordType').findOne({ _id: id })
    );
    if (!record) {
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

    var isCommited = false;
    if (fieldIndex !== -1) {
        isCommited = true;
    }

    if (isCommited) {
        var tableDisplayFields = jsonpointer.get(
            record, '/state/tableDisplayFields'
        );
        var includedInTable = isIncludedInDisplayFields({
            displayFields: tableDisplayFields,
            subChannelKey, key
        });
        if (includedInTable) {
            throw new ApiError(400, 'FieldExistsInTableDisplayFields');
        }

        var optionDisplayFields = jsonpointer.get(
            record, '/state/optionListDisplayFields'
        );
        var includedInOptionList = isIncludedInDisplayFields({
            displayFields: optionDisplayFields,
            subChannelKey, key
        })
        if (includedInTable) {
            throw new ApiError(400, 'FieldExistsInOptionListDisplayFields');
        }

        var recordLabelTokens = jsonpointer.get(
            record, '/state/recordLabelDefinition/tokens'
        );
        var includedInLabelTokens = isIncludedInDisplayFields({
            displayFields: recordLabelTokens,
            subChannelKey, key
        });
        if (includedInLabelTokens) {
            throw new ApiError(400, 'FieldExistsInRecordLabelTokens');
        }
    }

    cache.isCommited = isCommited;
    cache.nextFieldsPointer = nextFieldsPointer;
    cache.nextFieldIndex = nextFieldIndex
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
    personnelId,
    dispatch,
}) => {
    var { payload } = message;
    var { id, subChannelKey, key } = payload;
    var {
        isCommited,
        nextFieldsPointer,
        nextFieldIndex
    } = cache;

    var path = convertPointerToPath(
        `${nextFieldsPointer}/${nextFieldIndex}`
    );

    var payload = undefined;
    if (isCommited) {
        await dispatch({
            collection: 'customRecordType',
            channelId: id,
            payload: { $set: {
                'state.isDirty': true,
                [`${path}.isDirty`]: true,
                [`${path}.isRemoved`]: true,
            }}
        });
        // TODO maybe we could allow to actually remove the field when
        // there are no records of that in db yet
    }
    else {
        await dispatch({
            collection: 'customRecordType',
            channelId: id,
            payload: { $unset: {
                [path]: true,
            }}
        });
        // FIXME: his is a workaround for:
        // http://jira.mongodb.org/browse/SERVER-1014
        await dispatch({
            collection: 'customRecordType',
            channelId: id,
            payload: { $pull: {
                [convertPointerToPath(nextFieldsPointer)]: null,
            }}
        });
    }

}

var isIncludedInDisplayFields = ({ displayFields, subChannelKey, key }) => {
    var target = (
        subChannelKey
        ? `/${subChannelKey}/state/custom/${key}`
        : `/state/custom/${key}`
    );

    var field = displayFields.find(it => {
        return it.dataPointer === target
    })

    return field ? true : false
}

module.exports = handler;
