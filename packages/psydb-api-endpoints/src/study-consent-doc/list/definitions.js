var displayFields = [
    {
        systemType: 'SaneString',
        pointer: '/state/studyRecordFormSnapshot/state/internalName',
        displayName: 'Internal Name', displayNameI18N: { 'de': 'Interner Name' }
    },
    {
        systemType: 'SaneString',
        pointer: '/state/studyRecordFormSnapshot/state/title',
        displayName: 'Title', displayNameI18N: { 'de': 'Titel' }
    },
    {
        systemType: 'SaneString', // FIXME: CRT
        pointer: '/subjectType',
        displayName: 'Subject Type', displayNameI18N: { 'de': 'Proband:innen-Typ' },
        props: { collection: 'subject' }
    },
    {
        systemType: 'ForeignId', // FIXME: CRT
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
