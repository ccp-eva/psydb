'use strict';
var keyBy = require('@mpieva/psydb-common-lib/src/key-by');
var gatherDisplayFieldData = require('@mpieva/psydb-common-lib/src/gather-display-field-data');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var fetchOneCustomRecordType = require('./fetch-one-custom-record-type');

var {
    convertCRTRecordToSettings,
    CRTSettings
} = require('@mpieva/psydb-common-lib');


var gatherDisplayFieldsForRecordType =  async ({
    db,
    collectionName,
    customRecordType,
    target,
    prefetched,
    permissions,
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
        staticOptionListDisplayFields,
    } = collectionCreatorData;


    var displayFields = undefined,
        availableDisplayFieldData = undefined;
    var mergedDisplayFieldData = undefined;
    
    var customRecordTypeRecord = undefined;
    if (hasCustomTypes) {
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

        var _converted = convertCRTRecordToSettings(customRecordTypeRecord);
        var crt = CRTSettings({ data: _converted });

        recordLabelDefinition = crt.getRecordLabelDefinition();
        availableDisplayFieldData = (
            crt.allFieldDefinitions().filter(it => {
                if (
                    permissions
                    && !permissions.hasFlag('canAccessSensitiveFields')
                ) {
                    if (it.props?.isSensitive) {
                        return false
                    }
                }
                return true
            })
        );

        mergedDisplayFieldData = displayFields = crt.augmentedDisplayFields(
            mapDisplayTargetToValueProperty(target)
        ).filter(it => {
            if (
                permissions
                && !permissions.hasFlag('canAccessSensitiveFields')
            ) {
                if (it.props?.isSensitive) {
                    return false
                }
            }
            return true
        });
    }
    // TODO: fixed types maybe
    else {
        // recodLabelDefinition is already set
        if (target === 'optionlist') {
            displayFields = (
                staticOptionListDisplayFields
                || staticDisplayFields
                || []
            );
        } else {
            displayFields = staticDisplayFields || [];
        }
        availableDisplayFieldData = availableStaticDisplayFields || [];

        var availableDisplayFieldDataByPointer = keyBy({
            items: availableDisplayFieldData,
            byProp: 'dataPointer'
        });

        mergedDisplayFieldData = (
            displayFields
            .filter(it => (
                !!availableDisplayFieldDataByPointer[it.dataPointer]
            ))
            .map(it => ({
                ...availableDisplayFieldDataByPointer[it.dataPointer],
                dataPointer: it.dataPointer,
            })
        ))
    }

    return ({
        displayFields,
        availableDisplayFieldData,
        mergedDisplayFieldData,
    });
}

var mapDisplayTargetToValueProperty = (target) => {
    switch (target) {
        case 'invite-selection-list':
            return 'selectionRow';
        case 'away-team-selection-list':
            return 'awayTeamSelection';
        case 'optionlist':
            return 'optionList';
        case 'table':
        default:
            return 'table';
    }
}

module.exports = gatherDisplayFieldsForRecordType;
