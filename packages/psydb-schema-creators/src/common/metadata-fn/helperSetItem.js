'use strict';

module.exports = (bag) => {
    var meta = {
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
    };
    return meta;
}
