'use strict';
module.exports = {
    customRecordType: {
        collection: 'customRecordType',
        isGenericRecord: false,
    },
    helperSet: {
        collection: 'helperSet',
        isGenericRecord: false,
        recordLabelDefinition: {
            format: '${0}',
            tokens: [ '/state/label' ]
        },
    },
    helperSetItem: {
        collection: 'helperSetItem',
        isGenericRecord: false,
        recordLabelDefinition: {
            format: '${0}',
            tokens: [ '/state/label' ]
        }
    },
    experimentOperatorTeam: {
        collection: 'experimentOperatorTeam',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasSubChannels: false,
        recordLabelDefinition: {
            format: '${0}',
            tokens: [ '/state/name' ]
        }
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
        recordLabelDefinition: {
            format: '${0} ${1}',
            tokens: [ '/gdpr/state/firstname', '/gdpr/state/lastname' ]
        }
    },
    researchGroup: {
        collection: 'researchGroup',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasSubChannels: false,
        recordLabelDefinition: {
            format: '${0}',
            tokens: [ '/state/shorthand' ]
        }
    },
    study: {
        collection: 'study',
        isGenericRecord: true,
        hasCustomTypes: true,
        hasSubChannels: false,
        // TODO: more as a note - maybe we should
        // rename "internal" to private
        // since theese are essentially fields we
        // dont want to search in or manipulate directly
        //
    },
    subject: {
        collection: 'subject',
        isGenericRecord: true,
        hasCustomTypes: true,
        hasSubChannels: true,
        subChannelKeys: ['scientific', 'gdpr'],
    },
    systemRole: {
        collection: 'systemRole',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasSubChannels: false,
        recordLabelDefinition: {
            format: '${0}',
            tokens: [ '/state/name' ]
        }
    },
    reservation: {
        collection: 'reservation',
        isGenericRecord: false,
        hasCustomTypes: false,
        hasFixedTypes: true,
        fixedTypes: [ 'awayTeam', 'inhouse' ],
        hasSubChannels: false,
    },
    experiment: {
        collection: 'experiment',
        isGenericRecord: false,
        hasCustomTypes: false,
        hasFixedTypes: false,
        hasSubChannels:false,
    },
}
