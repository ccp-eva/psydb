'use strict';

module.exports = (bag) => {
    var meta = {
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
    };
    return meta;
}
