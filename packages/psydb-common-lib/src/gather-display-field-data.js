'use strict';
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

// TODO: should be renamed to gather "field data by pointer"

// TODO: non-custom fields
var gatherDisplayFieldData = ({
    customRecordTypeData
}) => {
    var collection = customRecordTypeData.collection;

    var metadata = allSchemaCreators[collection];
    var {
        hasSubChannels,
        subChannelKeys,
        availableStaticDisplayFields, // FIXME: not a big fan
    } = metadata;

    var settings = customRecordTypeData.state.settings;
    var fieldData = [
        {
            key: 'ID',
            systemType: 'Id',
            dataPointer: '/_id',
            displayName: 'ID',
        },
        ...(availableStaticDisplayFields || []),
    ];
    if (hasSubChannels) {
        for (var subChannelKey of subChannelKeys) {
            var fields = settings.subChannelFields[subChannelKey]
            for (var field of fields) {
                fieldData.push({
                    ...field,
                    dataPointer: `/${subChannelKey}/state/custom/${field.key}`
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
