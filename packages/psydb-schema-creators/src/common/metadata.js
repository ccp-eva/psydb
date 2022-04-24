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
                displayName: 'Anzeigename',
            },
            {
                key: '_collection',
                systemType: 'SaneString',
                dataPointer: '/collection',
                displayName: 'Collection',
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
                displayName: 'Bezeichnung',
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
                displayName: 'Bezeichnung',
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
                displayName: 'ID Nr.',
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
                displayName: 'Vorname',
            },
            {
                key: '_lastname',
                systemType: 'SaneString',
                dataPointer: '/gdpr/state/lastname',
                displayName: 'Nachname',
            },
        ],
        staticDisplayFields: [
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
                displayName: 'Kürzel',
            },
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
                displayName: 'ID Nr.',
                props: {},
            },
            {
                key: '_shorthand',
                systemType: 'SaneString',
                dataPointer: '/state/shorthand',
                displayName: 'Kürzel',
            },
            {
                key: '_name',
                systemType: 'SaneString',
                dataPointer: '/state/name',
                displayName: 'Studienname',
            },
            {
                key: '_scientistIds',
                systemType: 'ForeignIdList',
                props: {
                    collection: 'personnel',
                },
                dataPointer: '/state/scientistIds',
                displayName: 'Wissenschaftler',
            },
            {
                key: '_researchGroupIds',
                systemType: 'ForeignIdList',
                props: {
                    collection: 'researchGroup',
                },
                dataPointer: '/state/researchGroupIds',
                displayName: 'Forschungsgruppen',
            },
            {
                key: '_studyTopicIds',
                systemType: 'ForeignIdList',
                props: {
                    collection: 'studyTopic',
                },
                dataPointer: '/state/studyTopicIds',
                displayName: 'Themengebiete',
            },
            {
                key: '_start',
                systemType: 'DateOnlyServerSide',
                props: {},
                dataPointer: '/state/runningPeriod/start',
                displayName: 'Start',
            },
            {
                key: '_end',
                systemType: 'DateOnlyServerSide',
                props: {},
                dataPointer: '/state/runningPeriod/end',
                displayName: 'Ende',
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
                displayName: 'ID Nr.',
                props: {},
            },
            {
                key: '_onlineId',
                systemType: 'SaneString',
                dataPointer: '/onlineId',
                displayName: 'Online ID Code',
                props: {},
            },
            {
                key: '_comment',
                systemType: 'FullText',
                dataPointer: '/scientific/state/comment',
                displayName: 'Kommentar',
                props: {},
            },
            {
                key: '_testingPermissions',
                systemType: 'TestingPermissions',
                dataPointer: '/scientific/state/testingPermissions',
                displayName: 'Teilnahme-Erlaubnis',
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
                displayName: 'Bezeichnung',
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
                displayName: 'ID Nr.',
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
                displayName: 'ID Nr.',
                props: {},
            },
        ]
    },

}
