'use strict'
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var convertCRTRecordToSettings = (crtRecord) => {
    var { collection, type } = crtRecord; 
    
    var {
        hasSubChannels,
        availableStaticDisplayFields,
    } = allSchemaCreators[collection];

    var {
        isNew,
        isDirty,
        nextSettings,
        settings,
        ...otherState
    } = crtRecord.state;

    var {
        subChannelFields,
        fields,
        ...otherSettings
    } = settings;

    var fieldDefinitions = (
        hasSubChannels
        ? subChannelFields
        : fields
    );

    var staticFieldDefinitions = (
        (availableStaticDisplayFields || [])
        .map(it => ({
            ...it,
            pointer: it.dataPointer,
            type: it.systemType,
        }))
    );

    return {
        collection,
        type,
        hasSubChannels,
        fieldDefinitions,
        staticFieldDefinitions,
        ...otherSettings,
        ...otherState,
    }
}

module.exports = convertCRTRecordToSettings;
