'use strict';

module.exports = (bag) => {
    var meta = {
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
    };
    return meta;
}
