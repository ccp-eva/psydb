'use strict';

module.exports = (bag) => {
    var meta = {
        collection: 'experiment',
        isGenericRecord: false,
        hasCustomTypes: false,
        hasFixedTypes: false,
        hasSubChannels: false,
        // FIXME: not a big fan; see study
        // NOTE: subjectData itself is intentionally left out for now
        availableStaticDisplayFields: [
            {
                key: '_id',
                systemType: 'Id',
                dataPointer: '/_id',
                displayName: 'Internal ID',
                displayNameI18N: { de: 'Interne ID' },
            },
            {
                key: '_type',
                systemType: 'LabMethodKey',
                dataPointer: '/type',
                displayName: 'Lab Workflow',
                displayNameI18N: { de: 'Ablauf' },
            },
            {
                key: '_start',
                systemType: 'DateTime',
                props: {},
                dataPointer: '/state/interval/start',
                displayName: 'Start',
                displayNameI18N: { de: 'Beginn' },
            },
            {
                key: '_end',
                systemType: 'DateTime',
                props: {},
                dataPointer: '/state/interval/end',
                displayName: 'End',
                displayNameI18N: { de: 'Ende' },
            },
            {
                key: '_studyId',
                systemType: 'ForeignId',
                props: { collection: 'study' },
                dataPointer: '/state/studyId',
                displayName: 'Study',
                displayNameI18N: { de: 'Studie' },
            },
            {
                key: '_locationId',
                systemType: 'ForeignId',
                props: { collection: 'location' },
                dataPointer: '/state/locationId',
                displayName: 'Location',
                displayNameI18N: { de: 'Location' },
            },
            {
                key: '_experimentOperatorTeamId',
                systemType: 'ForeignId',
                props: { collection: 'experimentOperatorTeam' },
                dataPointer: '/state/experimentOperatorTeamId',
                displayName: 'Lab Team',
                displayNameI18N: { de: 'Team' },
            },
            {
                key: '_experimentOperatorIds',
                systemType: 'ForeignIdList',
                props: { collection: 'personnel' },
                dataPointer: '/state/experimentOperatorIds',
                displayName: 'Experimenters',
                displayNameI18N: { de: 'Experimenter:innen' },
            },
            {
                // NOTE: selectedSubjectIds mirrors subjectData[].subjectId
                key: '_selectedSubjectIds',
                systemType: 'ForeignIdList',
                props: { collection: 'subject' },
                dataPointer: '/state/selectedSubjectIds',
                displayName: 'Subjects',
                displayNameI18N: { de: 'Proband:innen' },
            },
            {
                key: '_isCanceled',
                systemType: 'DefaultBool',
                props: {},
                dataPointer: '/state/isCanceled',
                displayName: 'Canceled',
                displayNameI18N: { de: 'Abgesagt' },
            },
            {
                key: '_isPostprocessed',
                systemType: 'DefaultBool',
                props: {},
                dataPointer: '/state/isPostprocessed',
                displayName: 'Postprocessed',
                displayNameI18N: { de: 'Nachbereitet' },
            },
        ]
    };
    return meta;
}
