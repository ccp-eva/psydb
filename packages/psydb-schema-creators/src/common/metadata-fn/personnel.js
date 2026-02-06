'use strict';

module.exports = (bag) => {
    var meta = {
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
                key: '_sequenceNumber',
                systemType: 'SaneString',
                dataPointer: '/sequenceNumber',
                displayName: 'ID No.',
                displayNameI18N: { de: 'ID Nr.' },
                props: {},
            },
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
                dataPointer: '/sequenceNumber',
            },
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
    };
    return meta;
}
