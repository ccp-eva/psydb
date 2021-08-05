'use strict';
var keyBy = require('@mpieva/psydb-common-lib/src/key-by');
var gatherDisplayFieldData = require('@mpieva/psydb-common-lib/src/gather-display-field-data');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var fetchOneCustomRecordType = require('./fetch-one-custom-record-type');

var gatherDisplayFieldsForRecordType =  async ({
    db,
    collectionName,
    customRecordType,
    target,
    prefetched,
}) => {
    target = target || 'table';

    if (prefetched) {
        collectionName = prefetched.collection;
        customRecordType = prefetched.type;
    }
    
    var collectionCreatorData = allSchemaCreators[collectionName];
    if (!collectionCreatorData) {
        throw new Error(
            `no creator data found for collection "${collectionName}"`
        );
    }

    var {
        hasCustomTypes,
        hasSubChannels,
        recordLabelDefinition,
        availableStaticDisplayFields,
        staticDisplayFields,
    } = collectionCreatorData;


    var displayFields = undefined,
        availableDisplayFieldData = undefined;
    if (hasCustomTypes) {
        var customRecordTypeRecord = undefined;
        if (prefetched) {
            customRecordTypeRecord = prefetched;
        }
        else {
            customRecordTypeRecord = await fetchOneCustomRecordType({
                db,
                collection: collectionName,
                type: customRecordType,
            });
        }

        recordLabelDefinition = (
            customRecordTypeRecord.state.recordLabelDefinition
        );

        displayFields = customRecordTypeRecord.state[
            target === 'optionlist'
            ? 'optionListDisplayFields'
            : 'tableDisplayFields'
        ];

        availableDisplayFieldData = [
            ...(availableStaticDisplayFields || []),
            ...gatherDisplayFieldData({
                customRecordTypeData: customRecordTypeRecord
            })
        ]
    }
    // TODO: fixed types maybe
    else {
        // recodLabelDefinition is already set
        displayFields = staticDisplayFields || [];
        availableDisplayFieldData = availableStaticDisplayFields || [];
    }

    var availableDisplayFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer'
    });

    var mergedDisplayFieldData = displayFields.map(it => ({
        ...availableDisplayFieldDataByPointer[it.dataPointer],
        dataPointer: it.dataPointer,
    }))

    return ({
        displayFields,
        availableDisplayFieldData,
        mergedDisplayFieldData,
    });
}

module.exports = gatherDisplayFieldsForRecordType;
