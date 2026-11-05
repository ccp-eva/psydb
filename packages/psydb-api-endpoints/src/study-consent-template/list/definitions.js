var displayFields = [
    {
        systemType: 'SaneString', pointer: '/state/templateName',
        displayName: 'Template Shorthand', displayNameI18N: { 'de': 'Template-Kürzel' }
    },
    {
        systemType: 'SaneString', pointer: '/state/title',
        displayName: 'Title for Subjects',
        displayNameI18N: { 'de': 'Titel für Proband:innen' }
    },
    {
        systemType: 'CustomRecordTypeKey',
        pointer: '/studyType',
        displayName: 'Study Type', displayNameI18N: { 'de': 'Studien-Typ' },
        props: { collection: 'study' }
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
        systemType: 'CustomRecordTypeKey', pointer: '/studyType',
        props: { collection: 'study' }
    },
]

module.exports = {
    displayFields,
    constraints
}
