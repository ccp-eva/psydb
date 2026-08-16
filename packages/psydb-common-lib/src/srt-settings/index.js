'use strict';
var { keyBy, convertPointerToPath } = require('@mpieva/psydb-core-utils');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');
var createRecordLabel = require('../create-record-label');

var SRTSettings = (bag) => {
    var { collection } = bag;

    var _rawdata = allSchemaCreators[collection];
    if (!_rawdata || collection === 'customRecordType') {
        throw new Error(`invalid collection "${collection}"`);
    }

    var {
        hasSubChannels,
        hasCustomTypes,
        availableStaticDisplayFields = [],
        staticDisplayFields = [],
        staticOptionListDisplayFields = [],
        subChannelKeys = undefined,
        recordLabelDefinition = undefined,
    } = allSchemaCreators[collection];

    var staticFieldDefinitions = (
        availableStaticDisplayFields.map(it => ({
            ...it,
            pointer: it.dataPointer,
            type: it.systemType,
        }))
    );

    var data = {
        collection,
        hasCustomTypes,
        hasSubChannels,
        subChannelKeys,
        staticFieldDefinitions,
        recordLabelDefinition,
        displayFields: staticDisplayFields,
        optionListDisplayFields: staticOptionListDisplayFields,
    }
    
    var srt = {};

    srt.getRaw = () => data;
    srt.getCollection = () => data.collection;
    srt.getRecordLabelDefinition = () => data.recordLabelDefinition;
    srt.allStaticFields = () => data.staticFieldDefinitions;

    srt.getSubChannelKeys = () => {
        if (data.hasSubChannels) {
            //return Object.keys(data.fieldDefinitions);
            return subChannelKeys;
        }
        else {
            return undefined;
        }
    }

    srt.getRecordLabelPointers = () => {
        return data.recordLabelDefinition.tokens.map(it => it.dataPointer);
    }
    srt.getRecordLabelPointers = () => {
        return data.recordLabelDefinition.tokens.map(it => it.dataPointer);
    }
    srt.getRecordLabelProjection = (options = {}) => {
        var { as: projectAs } = options;
        return srt.getRecordLabelPointers().reduce((acc, pointer) => {
            var sourcePath = convertPointerToPath(pointer);
            var targetPath = (
                projectAs 
                ? projectAs + '.' + pointer
                : sourcePath
            );
            var projectionValue = (
                projectAs
                ? '$' + sourcePath
                : true
            );
            return {
                ...acc,
                [targetPath]: projectionValue
            }
        }, {})
    }
    
    srt.getLabelForRecord = (bag) => {
        var {
            record, i18n, timezone, language, locale,
            // FIXME: corresponds to 'as' in projection, but name is dumb
            // NOTE: maybe name it root or dataRoot?
            from = undefined,
        } = bag;

        if (!i18n) {
            i18n = { timezone, language, locale }
        }

        var definition = data.recordLabelDefinition;
        var label = createRecordLabel({ definition, record, from, i18n });

        return label;
    }
    
    // XXX oh gawd
    // FIXME: rename to just 'allFields()' ???
    // allFieldDefinitions?
    var __availableDisplayFieldsByPointer = keyBy({ items: [
        {
            key: 'ID',
            systemType: 'Id',
            dataPointer: '/_id', // FIXME
            displayName: 'ID',
        },
        ...srt.allStaticFields(),
    ], byProp: 'pointer' });
    
    srt.allFieldDefinitions = () => (
        Object.values(__availableDisplayFieldsByPointer)
    );
    
    srt.availableDisplayFields = (bag = {}) => {
        var { applyGeneralFlags = false } = bag;
        var clone = { ...__availableDisplayFieldsByPointer };
        return Object.values(clone);
    };

    srt.augmentedDisplayFields = (target) => {
        // FIXME: record lists target is lower case
        if (target === 'optionlist') {
            target = 'optionList';
        }

        // FIXME:gather-display-fields-for-record-type.js
        // uses full target name others dont
        var displayFields = data[
            /DisplayFields/.test(target)
            ? target
            : `${target}DisplayFields`
        ];
        return displayFields.map(it => (
            __availableDisplayFieldsByPointer[it.pointer || it.dataPointer]
        ));
    }
    
    return srt;
}

module.exports = SRTSettings;
