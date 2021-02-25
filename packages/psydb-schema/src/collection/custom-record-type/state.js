'use strict';
var {
    ExactObject,
    SaneString,
    IdentifierString,
} = require('@mpieva/psydb-schema-fields');

var {
    getCollectionMetadata,
    getSubChannels,
} = require('../../collection-metadata');

var CustomRecordTypeState = ({
    collection,
    enableInternalProps = false,
}) => {
    var meta = getCollectionMetadata({ collection });
    if (!meta.customTypes) {
        throw new Error(`custom types for "${collection}" are disabled`);
    }
    var subChannels = getSubChannels({ collection });
    return (
        subChannels.length > 0
        ? MultiChannelState({ subChannels, enableInternalProps })
        : SingleChannelState({ enableInternalProps })
    );
}

var RecordLabelDefinition = () => ExactObject({
    properties: {
        format: {
            // TODO: format
            type: 'string',
            default: '${0}',
        },
        tokens: {
            // TODO: items
            type: 'array',
            default: [ '/_id' ],
        },
    },
    required: [
        'format',
        'tokens'
    ]
});

var FieldList = ({
    enableFlags,
    enableInternalProps,
}) => ({
    // TODO: items,
    type: 'array',
    default: [],
    items: Field({ enableFlags, enableInternalProps }),
});

var Field = ({
    enableFlags,
    enableInternalProps,
}) => ExactObject({
    properties: {
        key: IdentifierString(),
        type: {
            type: 'string',
            enum: [
                'SaneString',
                'Address',
            ]
        },
        // TODO:
        // props: {},
        ...(enableFlags && enableInternalProps && ({
            isNew: { type: 'boolean', default: false },
            isDirty: { type: 'boolean', default: true },
        }))
    },
    required: [
        'key',
        'type',
        ...(
            (enableFlags && enableInternalProps)
            ? ([ 'isNew', 'isDirty' ])
            : ([])
        )
    ],
});

var Settings = ({ enableInternalProps }) => ExactObject({
    properties: {
        recordLabelDefinition: RecordLabelDefinition(),
        fields: FieldList({ enableInternalProps })
    },
    required: [
        'recordLabelDefinition',
        'fields',
    ]
});

var NextSettings = ({ enableInternalProps }) => ExactObject({
    properties: {
        recordLabelDefinition: RecordLabelDefinition(),
        fields: FieldList({
            enableFlags: true,
            enableInternalProps,
        }),
    },
    required: [
        'recordLabelDefinition',
        'fields',
    ]
});

// next..
// provisional...
// fixed...

var SubChannelSettings = ({ subChannels, settings }) => ExactObject({
    properties: {
        ...subChannels.reduce((acc, key) => ({
            ...acc,
            [key]: settings
        }), {})
    },
    required: subChannels
});
        

var ChannelState = ({
    enableInternalProps,
    nextSettings,
    settings
}) => ExactObject({
    properties: {
        label: SaneString(),
        ...(enableInternalProps && ({
            isDirty: { type: 'boolean', default: true },
        })),
        nextSettings,
        settings,
    },
    required: [
        'label',
        'nextSettings',
        'settings',
    ],
});

var SingleChannelState = ({ enableInternalProps }) => ChannelState({
    enableInternalProps,
    nextSettings: NextSettings({ enableInternalProps }),
    settings: Settings({ enableInternalProps }),
});

var MultiChannelState = ({
    subChannels,
    enableInternalProps,
}) => ChannelState({
    enableInternalProps,
    nextSettings: SubChannelSettings({
        subChannels,
        settings: NextSettings({ enableInternalProps }),
    }),
    settings: SubChannelSettings({
        subChannels,
        settings: Settings({ enableInternalProps }),
    }),
});

module.exports = CustomRecordTypeState;
