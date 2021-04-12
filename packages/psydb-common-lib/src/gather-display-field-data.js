'use strict';
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

// TODO: non-custom fields
var gatherDisplayFieldData = ({
    customRecordTypeData
}) => {
    var collection = customRecordTypeData.collection;

    var metadata = allSchemaCreators[collection];
    var {
        hasSubChannels,
        subChannelKeys,
        // availableStaticDisplayFields // maybe
    } = metadata;

    var fieldData = [],
        settings = customRecordTypeData.state.settings;
    if (hasSubChannels) {
        for (var subChannelKey of subChannelKeys) {
            var fields = settings.subChannelFields[subChannelKey]
            for (var field of fields) {
                fieldData.push({
                    ...field,
                    dataPointer: `/state/custom/${subChannelKey}/${field.key}`
                });
            }
        }
    }
    else {
        for (var field of settings.fields) {
            fieldData.push({
                ...field,
                dataPointer: `/state/custom/${field.key}`
            });
        }
    }

    return fieldData;
};

module.exports = gatherDisplayFieldData;
