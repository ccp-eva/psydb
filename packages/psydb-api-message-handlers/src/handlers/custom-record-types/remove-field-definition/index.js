'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var jsonpointer = require('jsonpointer');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../lib/simple-handler');
var PutMaker = require('../../../lib/put-maker');
var RemoveMaker = require('../../../lib/remove-maker');
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
        lastKnownEventId,
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

    var record = await (
        db.collection('customRecordType')
        .findOne({
            _id: id,
            'events.0._id': lastKnownEventId
        })
    );

    if (!record) {
        // FIXME: 409?
        // FIXME: name of tha status .... mke clear that it as changed
        // by someone else, and we cann not be sure that we perform the
        // operation safely (UnsafeRecordUpdate?)
        throw new ApiError(400, 'RecordHasChanged');
    }

    var fieldsPath = (
        subChannelKey
        ? `/state/settings/subChannelFields/${subChannelKey}`
        : `/state/settings/fields`
    );

    var nextFieldsPath = (
        subChannelKey
        ? `/state/nextSettings/subChannelFields/${subChannelKey}`
        : `/state/nextSettings/fields`
    );

    var fields = jsonpointer.get(record, fieldsPath);
    var nextFields = jsonpointer.get(record, nextFieldsPath);

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
    cache.nextFieldsPath = nextFieldsPath;
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
}) => {
    var { payload } = message;
    var { id, lastKnownEventId, subChannelKey, key } = payload;
    var {
        isCommited,
        nextFieldsPath,
        nextFieldIndex
    } = cache;

    var messages = undefined;
    if (isCommited) {
        messages = PutMaker({ personnelId }).all({
            '/state/isDirty': true,
            [`${nextFieldsPath}/${nextFieldIndex}/isDirty`]: true,
            [`${nextFieldsPath}/${nextFieldIndex}/isRemoved`]: true,
        });
        
        // TODO maybe we could allow to actually remove the field when
        // there are no records of that in db yet
    }
    else {
        messages = RemoveMaker({ personnelId }).all({
            [nextFieldsPath]: [
                nextFieldIndex
            ]
        })
    }
   
    var channel = (
        rohrpost
        .openCollection('customRecordType')
        .openChannel({
            id
        })
    );

    await channel.dispatchMany({
        lastKnownEventId,
        messages,
    });

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
