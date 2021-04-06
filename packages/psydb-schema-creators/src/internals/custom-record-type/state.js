'use strict';
var {
    ExactObject,
    SaneString,
    IdentifierString,
} = require('@mpieva/psydb-schema-fields');

/*var {
    getCollectionMetadata,
    getSubChannels,
} = require('../../collection-metadata');*/

var metadata = require('../../common/metadata');

var CustomRecordTypeState = ({
    collection,
    enableInternalProps = false,
} = {}) => {
    var collectionMeta = metadata[collection];
    if (!collectionMeta) {
        throw new Error(`unkown collection "${collection}"`);
    }
    if (!collectionMeta.isGenericRecord) {
        throw new Error(`collection "${collection}" is not a generic record collection`);
    }
    if (!collectionMeta.hasCustomTypes) {
        throw new Error(`custom types for "${collection}" are disabled`);
    }

    // NOTE: i hate doing this
    // TODO
    var canHaveDateOfBirthField = false;
    if (collection === 'subject') {
        canHaveDateOfBirthField = true;
    }

    var subChannels = (
        collectionMeta.hasSubChannels
        ? collectionMeta.subChannelKeys
        : []
    );
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

var ChannelSettings = ({
    enableFlags, // for next settings
    enableInternalProps, // stuff such as isDirty which isnt writable
    subChannels,
}) => ExactObject({
    properties: {
        recordLabelDefinition: RecordLabelDefinition(),
        ...(
            subChannels
            ? {
                subChannelFields: ExactObject({
                    properties: {
                        ...subChannels.reduce((acc, key) => ({
                            ...acc,
                            [key]: FieldList({
                                enableFlags,
                                enableInternalProps
                            })
                        }), {})
                    },
                    required: [
                        ...subChannels
                    ]
                })
            }
            : {
                fields: FieldList({ enableFlags, enableInternalProps })
            }
        )
    },
    required: [
        'recordLabelDefinition',
        subChannels ? 'subChannelFields' : 'fields',
    ],
})

// next..
// provisional...
// fixed...

var ChannelState = ({
    enableInternalProps,
    nextSettings,
    settings
}) => ExactObject({
    properties: {
        label: SaneString(),
        ...(enableInternalProps && ({
            isNew: { type: 'boolean', default: true },
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
    nextSettings: ChannelSettings({
        enableFlags: true,
        enableInternalProps
    }),
    settings: ChannelSettings({
        enableInternalProps
    }),
});

var MultiChannelState = ({
    subChannels,
    enableInternalProps,
}) => ChannelState({
    enableInternalProps,
    nextSettings: ChannelSettings({
        enableFlags: true,
        enableInternalProps,
        subChannels,
    }),
    settings: ChannelSettings({
        enableInternalProps,
        subChannels,
    }),
});

module.exports = CustomRecordTypeState;
