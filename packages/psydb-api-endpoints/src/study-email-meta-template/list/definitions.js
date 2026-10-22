var displayFields = [
    {
        systemType: 'SaneString', pointer: '/state/templateName',
        displayName: 'Template Shorthand', displayNameI18N: { 'de': 'Template-Kürzel' }
    },
    {
        systemType: 'SaneString', pointer: '/state/mailSubject',
        displayName: 'Subject Line', displayNameI18N: { 'de': 'Betreff' }
    },
    {
        systemType: 'SaneString', // FIXME: CRT
        pointer: '/studyType',
        displayName: 'Study Type', displayNameI18N: { 'de': 'Studien-Typ' },
    },
    {
        systemType: 'SaneString', // FIXME: CRT
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
