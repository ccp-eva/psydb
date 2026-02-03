'use strict';

module.exports = (bag) => {
    var meta = {
        collection: 'study',
        isGenericRecord: true,
        hasCustomTypes: true,
        hasSubChannels: false,
        // FIXME: not a big fan
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
            {
                key: '_shorthand',
                systemType: 'SaneString',
                dataPointer: '/state/shorthand',
                displayName: 'Shorthand',
                displayNameI18N: { de: 'Kürzel' },
            },
            {
                key: '_name',
                systemType: 'SaneString',
                dataPointer: '/state/name',
                displayName: 'Name',
                displayNameI18N: { de: 'Name' },
            },
            {
                key: '_scientistIds',
                systemType: 'ForeignIdList',
                props: {
                    collection: 'personnel',
                },
                dataPointer: '/state/scientistIds',
                displayName: 'Scientists',
                displayNameI18N: { de: 'Wissenschaftler:innen' },
            },
            {
                key: '_researchGroupIds',
                systemType: 'ForeignIdList',
                props: {
                    collection: 'researchGroup',
                },
                dataPointer: '/state/researchGroupIds',
                displayName: 'Research Groups',
                displayNameI18N: { de: 'Forschungsgruppen' },
            },
            {
                key: '_studyTopicIds',
                systemType: 'ForeignIdList',
                props: {
                    collection: 'studyTopic',
                },
                dataPointer: '/state/studyTopicIds',
                displayName: 'Study Topics',
                displayNameI18N: { de: 'Themengebiete' },
            },
            {
                key: '_experimentNames',
                systemType: 'SaneStringList',
                dataPointer: '/state/experimentNames',
                displayName: 'Experiment Names',
                displayNameI18N: { de: 'Namen der Experimente' },
            },
            {
                key: '_start',
                systemType: 'DateOnlyServerSide',
                props: {},
                dataPointer: '/state/runningPeriod/start',
                displayName: 'Start',
                displayNameI18N: { de: 'Beginn' },
            },
            {
                key: '_end',
                systemType: 'DateOnlyServerSide',
                props: {},
                dataPointer: '/state/runningPeriod/end',
                displayName: 'End',
                displayNameI18N: { de: 'Ende' },
            },
        ]
        // TODO: more as a note - maybe we should
        // rename "internal" to private
        // since theese are essentially fields we
        // dont want to search in or manipulate directly
        // NOTE: but we need to be able to read them
        // and we want to track changes
        // maybe 'internal' subchannel?
    };
    return meta;
}
