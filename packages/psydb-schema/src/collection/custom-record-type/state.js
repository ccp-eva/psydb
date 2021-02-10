'use strict';
var {
    ExactObject,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var {
    getCollectionMetadata,
    getSubChannels,
} = require('../../collection-metadata');

var CustomRecordTypeState = ({ collection }) => {
    var meta = getCollectionMetadata({ collection });
    if (!meta.customTypes) {
        throw new Error(`custom types for "${collection}" are disabled`);
    }
    var subChannels = getSubChannels({ collection });
    return (
        subChannels.length > 0
        ? MultiChannelState({ subChannels })
        : SingleChannelState()
    );
}

var RecordLabelDefinition = () => ExactObject({
    properties: {
        format: {
            // TODO: format
            type: 'string',
        },
        tokens: {
            // TODO: items
            type: 'array',
        },
    },
    required: [
        'format',
        'tokens'
    ]
});

var FieldList = () => ({
    type: 'array',
    default: [],
});

var Settings = () => ExactObject({
    properties: {
        recordLabelDefinition: RecordLabelDefinition(),
        fields: FieldList()
    },
    required: [
        'recordLabelDefinition',
        'fields',
    ]
});

// next..
// provisional...
// fixed...

var SubChannelSettings = ({ subChannels }) => ExactObject({
    properties: {
        ...subChannels.reduce((acc, key) => ({
            ...acc,
            [key]: Settings()
        }), {})
    },
    required: subChannels
});
        

var ChannelState = ({
    nextSettings,
    settings
}) => ExactObject({
    properties: {
        label: SaneString(),
        // isDirty boolean or nextSettings obj|undefined?
        nextSettings,
        settings,
    },
    required: [
        'label',
        'nextSettings',
        'settings',
    ],
});

var SingleChannelState = () => ChannelState({
    nextSettings: Settings(),
    settings: Settings(),
});

var MultiChannelState = ({ subChannels }) => ChannelState({
    nextSettings: SubChannelSettings({ subChannels }),
    settings: SubChannelSettings({ subChannels }),
});

module.exports = CustomRecordTypeState
