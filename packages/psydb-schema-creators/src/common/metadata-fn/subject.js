'use strict';

module.exports = (bag) => {
    var meta = {
        collection: 'subject',
        isGenericRecord: true,
        hasCustomTypes: true,
        hasSubChannels: true,
        subChannelKeys: ['gdpr', 'scientific'],
        
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
                key: '_onlineId',
                systemType: 'SaneString',
                dataPointer: '/onlineId',
                displayName: 'Online ID Code',
                displayNameI18N: { de: 'Online ID Code' },
                props: {},
            },
            {
                key: '_comment',
                systemType: 'FullText',
                dataPointer: '/scientific/state/comment',
                displayName: 'Comment',
                displayNameI18N: { de: 'Kommentar' },
                props: {},
            },
            {
                key: '_testingPermissions',
                systemType: 'TestingPermissions',
                dataPointer: '/scientific/state/testingPermissions',
                displayName: 'Participation Permissions',
                displayNameI18N: { de: 'Teilnahme-Erlaubnis' },
                props: {},
            },
        ],
    };
    return meta;
}
