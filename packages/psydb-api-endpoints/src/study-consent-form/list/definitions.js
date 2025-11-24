var displayFields = [
    { systemType: 'SaneString', pointer: '/state/internalName' },
    { systemType: 'SaneString', pointer: '/state/title' },
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
