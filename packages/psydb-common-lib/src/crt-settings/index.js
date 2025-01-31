'use strict';
var sift = require('sift').default;
var {
    jsonpointer,
    arrify,
    keyBy,
    convertPointerToPath
} = require('@mpieva/psydb-core-utils');

var convertCRTRecordToSettings = require('../convert-crt-record-to-settings');
var stringifiers = require('../field-stringifiers');

var CRTSettings = ({ data }) => {
    var crt = {};
    var flattenedFieldDefinitions = undefined;

    crt.getFlattenedFieldDefinitions = () => {
        if (!flattenedFieldDefinitions) {
            var flattened = [];
            var subChannels = crt.getSubChannelKeys();
            if (subChannels) {
                for (var sc of subChannels) {
                    for (var field of data.fieldDefinitions[sc]) {
                        flattened.push(__compatDef({
                            ...field,
                            subChannel: sc,
                        }))
                    }
                }
            }
            else {
                flattened = data.fieldDefinitions.map(__compatDef);
            }

            flattenedFieldDefinitions = flattened;
        }

        return flattenedFieldDefinitions;
    }

    crt.getRaw = () => data;
    crt.getType = () => data.type;
    crt.getCollection = () => data.collection;
    crt.getDisplayName = () => data.label;
    crt.getRecordLabelDefinition = () => data.recordLabelDefinition;
    crt.allStaticFields = () => (data.staticFieldDefinitions || []);
   
    crt.getSubChannelKeys = () => {
        if (data.hasSubChannels) {
            return Object.keys(data.fieldDefinitions);
        }
        else {
            return undefined;
        }
    }

    crt.hasSubChannels = (maybeNames) => {
        if (data.hasSubChannels) {
            var keys = crt.getSubChannelKeys()
            if (maybeNames) {
                maybeNames = arrify(maybeNames);
                keys = keys.filter(it => maybeNames.includes(it));
            }
            return keys;
        }
        else {
            return false
        }
    }

    crt.allCustomFields = crt.getFlattenedFieldDefinitions;
    crt.findCustomFields = (filter) => {
        var fields = crt.getFlattenedFieldDefinitions();
        return (
            filter
            ? fields.filter(sift(filter))
            : fields
        );
    }
    crt.findRequiredCustomFields = () => {
        var required = crt.findCustomFields({ $or: [
            { 'props.minLength': { $gt: 0 }},
            { 'props.minItems': { $gt: 0 }},
            {
                'systemType': { $in: [
                    'ForeignId',
                    'HelperSetItem',
                    'DateOnlyServerSide',
                    'DateTime',
                    'Integer',
                ]},
                'props.isNullable': { $ne: true }
            },
            // FIXME: should maybe have an optonal
            // or a 'default unknwon' flag or something
            { 'systemType': { $in: [
                'BiologicalGender'
            ]}}
        ]});
        return required;
    }

    crt.getRecordLabelPointers = () => {
        return data.recordLabelDefinition.tokens.map(it => it.dataPointer);
    }
    crt.getRecordLabelProjection = (options = {}) => {
        var { as: projectAs } = options;
        return crt.getRecordLabelPointers().reduce((acc, pointer) => {
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
    crt.getLabelForRecord = (bag) => {
        var {
            record,
            timezone, language, locale,
            // FIXME: corresponds to 'as' in projection, but name is dumb
            from = undefined,
        } = bag;

        var { format, tokens } = data.recordLabelDefinition;

        var label = format;
        var tokensRedacted = 0;

        for (var [index, token] of tokens.entries()) {
            var { systemType, dataPointer } = token;

            var value = (
                from
                ? jsonpointer.get(record, from)[dataPointer]
                : jsonpointer.get(record, dataPointer)
            );
            if (value === undefined) {
                value = '[REDACTED]';
                tokensRedacted += 1;
            }
            else {
                var stringify = stringifiers[systemType];
                if (stringify) {
                    value = stringify(value, {
                        short: true,
                        timezone, language, locale,
                    });
                }
            }

            label = label.replace('${#}', value);
        }

        if (tokensRedacted === tokens.length) {
            label = `${record._id} [REDACTED]`;
        }
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
        ...crt.allStaticFields(),
        ...crt.allCustomFields(),
    ], byProp: 'pointer' });

    crt.allFieldDefinitions = () => (
        Object.values(__availableDisplayFieldsByPointer)
    );
    crt.availableDisplayFields = () => (
        Object.values(__availableDisplayFieldsByPointer)
    );
    crt.augmentedDisplayFields = (target) => {
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
    return crt;
}

var __compatDef = (def) => ({
    ...def,
    systemType: def.type, // FIXME: compat for new
    dataPointer: def.pointer // FIXME: compat for old
})

CRTSettings.fromRecord = (record) => (
    CRTSettings({ data: convertCRTRecordToSettings(record) })
)

module.exports = CRTSettings;
