'use strict';
module.exports = {
    customRecordType: {
        collection: 'customRecordType',
        isGenericRecord: false,
    },
    helperSet: {
        collection: 'helperSet',
        isGenericRecord: false,
    },
    helperSetItem: {
        collection: 'helperSetItem',
        isGenericRecord: false,
    },
    experimentOperatorTeam: {
        collection: 'experimentOperatorTeam',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasSubChannels: false,
    },
    location: {
        collection: 'location',
        isGenericRecord: true,
        hasCustomTypes: true,
        hasSubChannels: false,
    },
    personnel: {
        collection: 'personnel',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasSubChannels: true,
        subChannelKeys: ['scientific', 'gdpr'],
    },
    researchGroup: {
        collection: 'researchGroup',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasSubChannels: false,
    },
    study: {
        collection: 'study',
        isGenericRecord: true,
        hasCustomTypes: true,
        hasSubChannels: false,
    },
    sysstemRole: {
        collection: 'systemRole',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasSubChannels: false,
    }
}
