'use strict';

module.exports = (bag) => {
    var meta = {
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
    };
    return meta;
}
