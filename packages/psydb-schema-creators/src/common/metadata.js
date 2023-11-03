'use strict';
module.exports = {
    customRecordType: {
        collection: 'customRecordType',
        isGenericRecord: false,
        availableStaticDisplayFields: [
            {
                key: '_label',
                systemType: 'SaneString',
                dataPointer: '/state/label',
                displayName: 'Display Name',
                displayNameI18N: { de: 'Anzeigename' },
            },
            {
                key: '_collection',
                systemType: 'SaneString',
                dataPointer: '/collection',
                displayName: 'Collection',
                displayNameI18N: { de: 'Collection' },
            },
        ],
        staticDisplayFields: [
            {
                systemType: 'SaneString',
                dataPointer: '/state/label',
            },
            {
                systemType: 'SaneString',
                dataPointer: '/collection',
            },
        ],
        recordLabelDefinition: {
            format: '${#}',
            tokens: [
                {
                    systemType: 'SaneString',
                    dataPointer: '/state/label'
                }
            ]
        },
    },
    helperSet: {
        collection: 'helperSet',
        isGenericRecord: false,
        recordLabelDefinition: {
            format: '${#}',
            tokens: [
                {
                    systemType: 'SaneString',
                    dataPointer: '/state/label'
                }
            ]
        },
        availableStaticDisplayFields: [
            {
                key: '_label',
                systemType: 'SaneString',
                dataPointer: '/state/label',
                displayName: 'Table Name',
                displayNameI18N: { de: 'Tabellen-Bezeichnung' },
            },
        ],
        staticDisplayFields: [
            {
                systemType: 'SaneString',
                dataPointer: '/state/label',
            },
        ]
    },
    helperSetItem: {
        collection: 'helperSetItem',
        isGenericRecord: false,
        recordLabelDefinition: {
            format: '${#}',
            tokens: [
                {
                    systemType: 'SaneString',
                    dataPointer: '/state/label'
                }
            ]
        },
        availableStaticDisplayFields: [
            {
                key: '_label',
                systemType: 'SaneString',
                dataPointer: '/state/label',
                displayName: 'Item Name',
                displayNameI18N: { de: 'Options-Name' },
            },
        ],
        staticDisplayFields: [
            {
                systemType: 'SaneString',
                dataPointer: '/state/label',
            },
        ]
    },
    experimentOperatorTeam: {
        collection: 'experimentOperatorTeam',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasSubChannels: false,
        recordLabelDefinition: {
            format: '${#}',
            tokens: [
                {
                    systemType: 'SaneString',
                    dataPointer: '/state/name'
                }
            ]
        }
    },
    location: {
        collection: 'location',
        isGenericRecord: true,
        hasCustomTypes: true,
        hasSubChannels: false,
        availableStaticDisplayFields: [
            {
                key: '_id',
                systemType: 'SaneString',
                dataPointer: '/_id',
                displayName: 'ID',
            },
            {
                key: '_sequenceNumber',
                systemType: 'Integer',
                dataPointer: '/sequenceNumber',
                displayName: 'ID No.',
                displayNameI18N: { de: 'ID Nr.' },
                props: {},
            },
            {
                key: '_comment',
                systemType: 'FullText',
                dataPointer: '/state/comment',
                displayName: 'Comment',
                displayNameI18N: { de: 'Kommentar' },
                props: {},
            },
        ]
    },
    personnel: {
        collection: 'personnel',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasSubChannels: true,
        subChannelKeys: ['gdpr', 'scientific'],
        recordLabelDefinition: {
            format: '${#} ${#}',
            tokens: [
                {
                    systemType: 'SaneString',
                    dataPointer: '/gdpr/state/firstname',
                },
                {
                    systemType: 'SaneString',
                    dataPointer: '/gdpr/state/lastname',
                }
            ]
        },
        availableStaticDisplayFields: [
            {
                key: '_firstname',
                systemType: 'SaneString',
                dataPointer: '/gdpr/state/firstname',
                displayName: 'Firstname',
                displayNameI18N: { de: 'Vorname' },
            },
            {
                key: '_lastname',
                systemType: 'SaneString',
                dataPointer: '/gdpr/state/lastname',
                displayName: 'Lastname',
                displayNameI18N: { de: 'Nachname' },
            },
            {
                key: '_phones',
                systemType: 'PhoneWithTypeList',
                dataPointer: '/gdpr/state/phones',
                displayName: 'Phone',
                displayNameI18N: { de: 'Telefon' },
            },
            {
                key: '_emails',
                systemType: 'EmailList',
                dataPointer: '/gdpr/state/emails',
                displayName: 'E-Mail',
                displayNameI18N: { de: 'E-Mail' },
            },
            {
                key: '_researchGroupSettings',
                systemType: 'PersonnelResearchGroupSettingsList',
                dataPointer: '/scientific/state/researchGroupSettings',
                displayName: 'Sysetm Roles',
                displayNameI18N: { de: 'System-Rollen' },
            },
            {
                key: '_canLogIn',
                systemType: 'DefaultBool',
                dataPointer: '/scientific/state/canLogIn',
                displayName: 'Log-In?',
                displayNameI18N: { de: 'Log-In?' },
            },
            {
                key: '_descriptions',
                systemType: 'FullText',
                dataPointer: '/gdpr/state/description',
                displayName: 'Description',
                displayNameI18N: { de: 'Beschreibung' },
            },
        ],
        staticDisplayFields: [
            {
                systemType: 'SaneString',
                dataPointer: '/gdpr/state/lastname',
            },
            {
                systemType: 'SaneString',
                dataPointer: '/gdpr/state/firstname',
            },
            {
                systemType: 'PhoneWithTypeList',
                dataPointer: '/gdpr/state/phones',
            },
            {
                systemType: 'EmailList',
                dataPointer: '/gdpr/state/emails',
            },
            {
                systemType: 'PersonnelResearchGroupSettingsList',
                dataPointer: '/scientific/state/researchGroupSettings',
            },
            {
                systemType: 'DefaultBool',
                dataPointer: '/scientific/state/canLogIn',
            },
            {
                systemType: 'FullText',
                dataPointer: '/gdpr/state/description',
            },
        ],
        staticOptionListDisplayFields: [
            {
                systemType: 'SaneString',
                dataPointer: '/gdpr/state/lastname',
            },
            {
                systemType: 'SaneString',
                dataPointer: '/gdpr/state/firstname',
            },
        ]
    },
    researchGroup: {
        collection: 'researchGroup',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasSubChannels: false,
        recordLabelDefinition: {
            format: '${#}',
            tokens: [
                {
                    systemType: 'SaneString',
                    dataPointer: '/state/shorthand',
                },
            ]
        },
        availableStaticDisplayFields: [
            {
                key: '_shorthand',
                systemType: 'SaneString',
                dataPointer: '/state/shorthand',
                displayName: 'Shorthand',
                displayNameI18N: { de: 'Kürzel' },
            },
            {
                key: '_name',
                systemType: 'SaneString',
                dataPointer: '/state/name',
                displayName: 'Name',
                displayNameI18N: { de: 'Name' },
            },
        ],
        staticDisplayFields: [
            {
                systemType: 'SaneString',
                dataPointer: '/state/shorthand',
            },
            {
                systemType: 'SaneString',
                dataPointer: '/state/name',
            }
        ]
    },
    study: {
        collection: 'study',
        isGenericRecord: true,
        hasCustomTypes: true,
        hasSubChannels: false,
        // FIXME: not a big fan
        availableStaticDisplayFields: [
            {
                key: '_id',
                systemType: 'SaneString',
                dataPointer: '/_id',
                displayName: 'ID',
            },
            {
                key: '_sequenceNumber',
                systemType: 'Integer',
                dataPointer: '/sequenceNumber',
                displayName: 'ID No.',
                displayNameI18N: { de: 'ID Nr.' },
                props: {},
            },
            {
                key: '_shorthand',
                systemType: 'SaneString',
                dataPointer: '/state/shorthand',
                displayName: 'Shorthand',
                displayNameI18N: { de: 'Kürzel' },
            },
            {
                key: '_name',
                systemType: 'SaneString',
                dataPointer: '/state/name',
                displayName: 'Name',
                displayNameI18N: { de: 'Name' },
            },
            {
                key: '_scientistIds',
                systemType: 'ForeignIdList',
                props: {
                    collection: 'personnel',
                },
                dataPointer: '/state/scientistIds',
                displayName: 'Scientists',
                displayNameI18N: { de: 'Wissenschaftler:innen' },
            },
            {
                key: '_researchGroupIds',
                systemType: 'ForeignIdList',
                props: {
                    collection: 'researchGroup',
                },
                dataPointer: '/state/researchGroupIds',
                displayName: 'Research Groups',
                displayNameI18N: { de: 'Forschungsgruppen' },
            },
            {
                key: '_studyTopicIds',
                systemType: 'ForeignIdList',
                props: {
                    collection: 'studyTopic',
                },
                dataPointer: '/state/studyTopicIds',
                displayName: 'Study Topics',
                displayNameI18N: { de: 'Themengebiete' },
            },
            {
                key: '_start',
                systemType: 'DateOnlyServerSide',
                props: {},
                dataPointer: '/state/runningPeriod/start',
                displayName: 'Start',
                displayNameI18N: { de: 'Beginn' },
            },
            {
                key: '_end',
                systemType: 'DateOnlyServerSide',
                props: {},
                dataPointer: '/state/runningPeriod/end',
                displayName: 'End',
                displayNameI18N: { de: 'Ende' },
            },
        ]
        // TODO: more as a note - maybe we should
        // rename "internal" to private
        // since theese are essentially fields we
        // dont want to search in or manipulate directly
        // NOTE: but we need to be able to read them
        // and we want to track changes
        // maybe 'internal' subchannel?
    },
    studyTopic: {
        collection: 'studyTopic',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasSubChannels: false,
        recordLabelDefinition: {
            format: '${#}',
            tokens: [
                {
                    systemType: 'SaneString',
                    dataPointer: '/state/name',
                },
            ]
        },
        availableStaticDisplayFields: [
            {
                key: '_name',
                systemType: 'SaneString',
                dataPointer: '/state/name',
                displayName: 'Name',
            },
        ],
        staticDisplayFields: [
            {
                systemType: 'SaneString',
                dataPointer: '/state/name',
            }
        ]
    },
    subject: {
        collection: 'subject',
        isGenericRecord: true,
        hasCustomTypes: true,
        hasSubChannels: true,
        subChannelKeys: ['gdpr', 'scientific'],
        
        availableStaticDisplayFields: [
            {
                key: '_sequenceNumber',
                systemType: 'Integer',
                dataPointer: '/sequenceNumber',
                displayName: 'ID No.',
                displayNameI18N: { de: 'ID Nr.' },
                props: {},
            },
            {
                key: '_onlineId',
                systemType: 'SaneString',
                dataPointer: '/onlineId',
                displayName: 'Online ID Code',
                displayNameI18N: { de: 'Online ID Code' },
                props: {},
            },
            {
                key: '_comment',
                systemType: 'FullText',
                dataPointer: '/scientific/state/comment',
                displayName: 'Comment',
                displayNameI18N: { de: 'Kommentar' },
                props: {},
            },
            {
                key: '_testingPermissions',
                systemType: 'TestingPermissions',
                dataPointer: '/scientific/state/testingPermissions',
                displayName: 'Participation Permissions',
                displayNameI18N: { de: 'Teilnahme-Erlaubnis' },
                props: {},
            },
        ],
    },
    
    subjectGroup: {
        collection: 'subjectGroup',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasSubChannels: false,
        recordLabelDefinition: {
            format: '${#}',
            tokens: [
                {
                    systemType: 'SaneString',
                    dataPointer: '/state/name',
                },
            ]
        },
        availableStaticDisplayFields: [
            {
                key: '_subjectType',
                systemType: 'CustomRecordTypeKey',
                props: {
                    collection: 'subject',
                },
                dataPointer: '/subjectType',
                displayName: 'Proband:innen-Typ',
            },
            {
                key: '_name',
                systemType: 'SaneString',
                dataPointer: '/state/name',
                displayName: 'Name',
            },
            {
                key: '_locationType',
                systemType: 'CustomRecordTypeKey',
                props: {
                    collection: 'location',
                },
                dataPointer: '/state/locationType',
                displayName: 'Location-Typ',
            },
            {
                key: '_locationId',
                systemType: 'ForeignId',
                props: {
                    collection: 'location',
                },
                dataPointer: '/state/locationId',
                displayName: 'Location',
            },
        ],
        staticDisplayFields: [
            {
                systemType: 'CustomRecordTypeKey',
                dataPointer: '/subjectType',
            },
            {
                systemType: 'CustomRecordTypeKey',
                dataPointer: '/state/locationType',
            },
            {
                systemType: 'ForeignId',
                dataPointer: '/state/locationId',
            },
            {
                systemType: 'SaneString',
                dataPointer: '/state/name',
            },
        ]
    },

    subjectSelector: {
        collection: 'subjectSelector',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasFixedTypes: false,
        hasSubChannels: false,
    },

    subjectSelector: {
        collection: 'ageFrame',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasFixedTypes: false,
        hasSubChannels: false,
    },

    systemRole: {
        collection: 'systemRole',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasSubChannels: false,
        recordLabelDefinition: {
            format: '${#}',
            tokens: [
                {
                    systemType: 'SaneString',
                    dataPointer: '/state/name'
                }
            ]
        },
        availableStaticDisplayFields: [
            {
                key: '_label',
                systemType: 'SaneString',
                dataPointer: '/state/name',
                displayName: 'Name',
                displayNameI18N: { de: 'Bezeichnung' },
            },
        ],
        staticDisplayFields: [
            {
                systemType: 'SaneString',
                dataPointer: '/state/name',
            }
        ]
    },
    reservation: {
        collection: 'reservation',
        isGenericRecord: false,
        hasCustomTypes: false,
        hasFixedTypes: true,
        fixedTypes: [ 'awayTeam', 'inhouse' ],
        hasSubChannels: false,
    },
    
    experimentVariant: {
        collection: 'experimentVariant',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasFixedTypes: false,
        hasSubChannels: false,
    },

    experimentVariantSetting: {
        collection: 'experimentVariantSetting',
        isGenericRecord: false,
        hasCustomTypes: false,
        hasFixedTypes: true,
        fixedTypes: [
            'online-survey',
            'online-video-call',
            'inhouse',
            'inhouse-group-simple',
            'away-team',
        ],
        hasSubChannels: false,
    },

    experiment: {
        collection: 'experiment',
        isGenericRecord: false,
        hasCustomTypes: false,
        hasFixedTypes: false,
        hasSubChannels:false,
    },
    
    externalOrganization: {
        collection: 'externalOrganization',
        isGenericRecord: true,
        hasCustomTypes: true,
        hasSubChannels: false,
        availableStaticDisplayFields: [
            {
                key: '_id',
                systemType: 'SaneString',
                dataPointer: '/_id',
                displayName: 'ID',
            },
            {
                key: '_sequenceNumber',
                systemType: 'Integer',
                dataPointer: '/sequenceNumber',
                displayName: 'ID No.',
                displayNameI18N: { de: 'ID Nr.' },
                props: {},
            },
        ]
    },

    externalPerson: {
        collection: 'externalPerson',
        isGenericRecord: true,
        hasCustomTypes: true,
        hasSubChannels: false,
        availableStaticDisplayFields: [
            {
                key: '_id',
                systemType: 'SaneString',
                dataPointer: '/_id',
                displayName: 'ID',
            },
            {
                key: '_sequenceNumber',
                systemType: 'Integer',
                dataPointer: '/sequenceNumber',
                displayName: 'ID No.',
                displayNameI18N: { de: 'ID Nr.' },
                props: {},
            },
        ]
    },

    apiKey: {
        collection: 'apiKey',
        isGenericRecord: false,
        hasCustomTypes: false,
        hasSubChannels: false,
        recordLabelDefinition: {
            format: '${#}',
            tokens: [
                {
                    systemType: 'SaneString',
                    dataPointer: '/state/label',
                },
            ]
        },
        availableStaticDisplayFields: [
            {
                key: '_personnelId',
                systemType: 'ForeignId',
                props: {
                    collection: 'personnel',
                },
                dataPointer: '/personnelId',
                displayName: 'Account',
                displayNameI18N: { de: 'Account' },
            },
            {
                key: '_apiKey',
                systemType: 'SaneString',
                dataPointer: '/apiKey',
                displayName: 'ApiKey',
                displayNameI18N: { de: 'ApiKey' },
            },
            {
                key: '_name',
                systemType: 'SaneString',
                dataPointer: '/state/label',
                displayName: 'Name',
                displayNameI18N: { de: 'Name' },
            },
        ],
        staticDisplayFields: [
            {
                systemType: 'ForeignId',
                dataPointer: '/personnelId',
            },
            {
                systemType: 'SaneString',
                dataPointer: '/state/label',
            },
            {
                systemType: 'SaneString',
                dataPointer: '/apiKey',
            },
        ]
    },
}
