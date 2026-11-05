'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { compose, switchComposition, ApiError }
    = require('@mpieva/psydb-api-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    verifyFieldRemovable,
]);

var verifyPermissions = async (context, next) => {
    var { permissions } = context;
    
    if (!permissions.isRoot()) {
        throw new ApiError(403)
    }
    
    await next();
}

var verifyFieldRemovable = async (context, next) => {
    var { db, message, cache } = context;
    var { key, subChannelKey } = message.payload;
    var { crtRecord } = cache.get();

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

    var fields = jsonpointer.get(crtRecord, fieldsPath);
    var nextFields = jsonpointer.get(crtRecord, nextFieldsPointer);

    var isKey = (it) => (it.key === key);
    var fieldIndex = fields.findIndex(isKey);
    var nextFieldIndex = nextFields.findIndex(isKey);

    var isCommited = false;
    if (fieldIndex !== -1) {
        isCommited = true;
    }

    if (isCommited) {
        var tableDisplayFields = jsonpointer.get(
            crtRecord, '/state/tableDisplayFields'
        );
        var includedInTable = isIncludedInDisplayFields({
            displayFields: tableDisplayFields,
            subChannelKey, key
        });
        if (includedInTable) {
            throw new ApiError(409, 'FieldExistsInTableDisplayFields');
        }

        var optionDisplayFields = jsonpointer.get(
            crtRecord, '/state/optionListDisplayFields'
        );
        var includedInOptionList = isIncludedInDisplayFields({
            displayFields: optionDisplayFields,
            subChannelKey, key
        })
        if (includedInTable) {
            throw new ApiError(409, 'FieldExistsInOptionListDisplayFields');
        }

        var recordLabelTokens = jsonpointer.get(
            crtRecord, '/state/recordLabelDefinition/tokens'
        );
        var includedInLabelTokens = isIncludedInDisplayFields({
            displayFields: recordLabelTokens,
            subChannelKey, key
        });
        if (includedInLabelTokens) {
            throw new ApiError(409, 'FieldExistsInRecordLabelTokens');
        }
    }

    cache.merge({
        isCommited,
        nextFieldsPointer,
        nextFieldIndex,
    });
    
    // TODO: check if record label definition is still valid

    // TODO: maybe check if every field that is included
    // in the currently fixed settings is equal to the field
    // in next Settings .... on the other hand that shouldnt happen
    // in the first place we should prevent that
    
    await next();
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

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
