var displayFields = [
    {
        systemType: 'SaneString', pointer: '/state/internalName',
        displayName: 'Shorthand', displayNameI18N: { 'de': 'Kürzel' }
    },
    {
        systemType: 'SaneString', pointer: '/state/title',
        displayName: 'Title for Subjects',
        displayNameI18N: { 'de': 'Titel für Proband:innen' }
    },
    {
        systemType: 'CustomRecordTypeKey',
        pointer: '/subjectType',
        displayName: 'Subject Type', displayNameI18N: { 'de': 'Proband:innen-Typ' },
        props: { collection: 'subject' }
    },
    {
        systemType: 'DefaultBool', pointer: '/state/isEnabled',
        displayName: 'Enabled', displayNameI18N: { 'de': 'Aktiv' }
    },
];

var constraints = [
    { 
        systemType: 'CustomRecordTypeKey', pointer: '/subjectType',
        props: { collection: 'subject' }
    },
    { 
        systemType: 'ForeignId', pointer: '/studyId',
        props: { collection: 'study' }
    },
]

module.exports = {
    displayFields,
    constraints
}
