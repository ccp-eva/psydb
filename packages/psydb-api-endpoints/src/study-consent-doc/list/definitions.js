var displayFields = [
    {
        systemType: 'SaneString',
        pointer: '/state/studyConsentFormSnapshot/state/internalName',
        displayName: 'Form Shorthand', displayNameI18N: { 'de': 'Formular-Kürzel' }
    },
    {
        systemType: 'SaneString',
        pointer: '/state/studyConsentFormSnapshot/state/title',
        displayName: 'Title', displayNameI18N: { 'de': 'Titel' }
    },
    {
        systemType: 'CustomRecordTypeKey',
        pointer: '/subjectType',
        displayName: 'Subject Type', displayNameI18N: { 'de': 'Proband:innen-Typ' },
        props: { collection: 'subject' }
    },
    {
        systemType: 'ForeignId',
        pointer: '/subjectId',
        displayName: 'Subject', displayNameI18N: { 'de': 'Proband:in' },
        props: { collection: 'subject', recordType: 'child' /* XXX */ }
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
    { 
        systemType: 'ForeignId', pointer: '/subjectId',
        props: { collection: 'subject' }
    },
]

module.exports = {
    displayFields,
    constraints
}
