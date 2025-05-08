'use strict';
var sift = require('sift').default;
var {
    jsonpointer,
    arrify,
    keyBy,
    convertPointerToPath
} = require('@mpieva/psydb-core-utils');

var convertCRTRecordToSettings = require('../convert-crt-record-to-settings');
var createRecordLabel = require('../create-record-label');

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
            record, i18n,
            timezone, language, locale,
            // FIXME: corresponds to 'as' in projection, but name is dumb
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
        ...crt.allStaticFields(),
        ...crt.allCustomFields(),
    ], byProp: 'pointer' });

    crt.allFieldDefinitions = () => (
        Object.values(__availableDisplayFieldsByPointer)
    );
    crt.availableDisplayFields = (bag = {}) => {
        var { applyGeneralFlags = false } = bag;
        var clone = { ...__availableDisplayFieldsByPointer };
        // XXX thats a hack
        if (applyGeneralFlags) {
            var {
                showSequenceNumber, showOnlineId,
                requiresTestingPermissions
            } = data;

            if (!showSequenceNumber) {
                delete clone['/sequenceNumber'];
            }
            if (!showOnlineId) {
                delete clone['/onlineId'];
            }
            if (!requiresTestingPermissions) {
                delete clone['/scientific/state/testingPermissions'];
            }
        }
        return Object.values(clone);
    };
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

CRTSettings.wrapResponsePromise = (promise, options = {}) => {
    promise.then(response => {
        response.data.data = CRTSettings({ data: response.data.data });
        return response;
    })
}

module.exports = CRTSettings;
