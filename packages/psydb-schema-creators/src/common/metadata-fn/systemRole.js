'use strict';

module.exports = (bag) => {
    var meta = {
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
    };
    return meta;
}

