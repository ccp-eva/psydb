'use strict';
var {
    ExactObject,
    OpenObject,
    SaneString,
    StringEnum,
    IdentifierString,
    DefaultBool,
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
        ? MultiChannelState({ collection, subChannels, enableInternalProps })
        : SingleChannelState({ collection, enableInternalProps })
    );
}

var RecordLabelDefinition = () => ExactObject({
    // TODO: see schema helpers
    properties: {
        format: {
            // TODO: format
            type: 'string',
            default: '${#}',
        },
        tokens: {
            // TODO: items
            type: 'array',
            default: [
                { systemType: 'Id', dataPointer: '/_id' }
            ],
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
    collection,
    enableInternalProps,
    nextSettings,
    settings
}) => ExactObject({
    properties: {
        label: SaneString(),
        displayNameI18N: OpenObject({
            de: SaneString(),
        }),
        ...( collection === 'subject' && {
            requiresTestingPermissions: DefaultBool({ default: true }),
            commentFieldIsSensitive: DefaultBool(),
            showSequenceNumber: DefaultBool({ default: true }),
            showOnlineId: DefaultBool({ default: true }),
        }),
        ...( collection === 'location' && {
            reservationType: StringEnum([
                'away-team',
                'inhouse',
                //'no-reservation' // FIXME
            ], { default: 'inhouse' }),
        }),
        ...( collection === 'study' && {
            enableSubjectSelectionSettings: DefaultBool(),
            enableLabTeams: DefaultBool(),
        }),
        recordLabelDefinition: RecordLabelDefinition(),
        formOrder: {
            type: 'array',
            default: []
        },
        tableDisplayFields: {
            type: 'array',
            default: []
        },
        optionListDisplayFields: {
            type: 'array',
            default: []
        },
        
        ...( collection === 'study' && {
            extraDescriptionDisplayFields: {
                type: 'array',
                default: []
            },
        }),
        
        ...( collection === 'subject' && {
            // FIXME: inhouse/invite
            // FIXME: rename inviteSelectionRowDisplayFields
            selectionRowDisplayFields: {
                type: 'array',
                default: []
            },
            awayTeamSelectionRowDisplayFields: {
                type: 'array',
                default: []
            },
            selectionSummaryDisplayFields: {
                type: 'array',
                default: []
            },
            inviteConfirmationSummaryDisplayFields: {
                type: 'array',
                default: []
            },
        }),

        ...(enableInternalProps && ({
            isNew: { type: 'boolean', default: true },
            isDirty: { type: 'boolean', default: true },
        })),
        nextSettings,
        settings,
    },
    required: [
        'label',
        'displayNameI18N',
        'nextSettings',
        'settings',
    ],
});

var SingleChannelState = ({
    collection,
    enableInternalProps
}) => ChannelState({
    collection,
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
    collection,
    subChannels,
    enableInternalProps,
}) => ChannelState({
    collection,
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
