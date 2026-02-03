'use strict';

module.exports = (bag) => {
    var meta = {
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
    }

    return meta;
}
