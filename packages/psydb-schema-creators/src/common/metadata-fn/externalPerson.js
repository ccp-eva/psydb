'use strict';

module.exports = (bag) => {
    var meta = {
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
                systemType: 'SaneString',
                dataPointer: '/sequenceNumber',
                displayName: 'ID No.',
                displayNameI18N: { de: 'ID Nr.' },
                props: {},
            },
        ]
    };
    return meta;
}

