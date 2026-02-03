'use strict';

module.exports = (bag) => {
    var meta = {
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
    };
    return meta;
}
