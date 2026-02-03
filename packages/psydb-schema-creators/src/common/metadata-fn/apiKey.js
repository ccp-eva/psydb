'use strict';

module.exports = (bag) => {
    var meta = {
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
                displayName: 'API Key',
                displayNameI18N: { de: 'API-Key' },
            },
            {
                key: '_name',
                systemType: 'SaneString',
                dataPointer: '/state/label',
                displayName: 'Name',
                displayNameI18N: { de: 'Name' },
            },
            {
                key: '_isEnabled',
                systemType: 'DefaultBool',
                dataPointer: '/state/isEnabled',
                displayName: 'Enabled',
                displayNameI18N: { de: 'Aktiv' },
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
    };
    return meta;
}

