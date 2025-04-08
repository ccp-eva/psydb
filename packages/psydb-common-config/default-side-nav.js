var nav = [
    { path: '/statistics' },
    { path: '/csv-imports' },
    { path: '/subjects' },
    { path: '/studies' },
    { path: '/calendars', subnav: [
        { path: '/reception' },
        { path: '/inhouse-appointments' },
        { path: '/external-appointments' },
        { path: '/video-appointments' },
    ]},
    { path: '/lab-operation', subnav: [
        { path: '/reservation' },
        { path: '/subject-selection' },
        { path: '/confirm-appointments' },
        { path: '/postprocessing' },
    ]},
    '=======',
    { path: '/locations' },
    { path: '/external-persons' },
    { path: '/external-organizations' },
    { path: '/subject-groups' },
    { path: '/study-topics' },
    { path: '/helper-tables' },
    { path: '/personnel' },
    '=======',
    { path: '/research-groups' },
    { path: '/system-roles' },
    { path: '/record-types' },
    { path: '/api-paths' },
    { path: '/audit' },
];

module.exports = nav;
