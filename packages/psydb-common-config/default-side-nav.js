var nav = [
    { key: 'statistics' },
    { key: 'csv-imports' },
    { key: 'subjects' },
    { key: 'studies' },
    { key: 'calendars', subnav: [
        { key: 'reception' },
        { key: 'inhouse-appointments' },
        { key: 'external-appointments' },
        { key: 'video-appointments' },
    ]},
    { key: 'lab-operation', subnav: [
        { key: 'reservation' },
        { key: 'subject-selection' },
        { key: 'confirm-appointments' },
        { key: 'postprocessing' },
    ]},
    '=======',
    { key: 'locations' },
    { key: 'external-persons' },
    { key: 'external-organizations' },
    { key: 'subject-groups' },
    { key: 'study-topics' },
    { key: 'helper-tables' },
    { key: 'staff-members' },
    '=======',
    { key: 'research-groups' },
    { key: 'system-roles' },
    { key: 'record-types' },
    { key: 'api-keys' },
    { key: 'audit' },
];

module.exports = nav;
