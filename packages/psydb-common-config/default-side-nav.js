var nav = [
    { path: '/statistics' },
    { path: '/csv-imports' },
    { path: '/subjects' },
    { path: '/studies' },
    { path: '/calendars', subnav: [
        { path: '/reception' },
        { path: '/inhouse' },
        { path: '/away-team' },
        { path: '/online-video-call' },
    ]},
    { path: '/lab-operation', subnav: [
        { path: '/reservation' },
        { path: '/subject-selection' },
        { path: '/invite-confirmation' },
        { path: '/experiment-postprocessing' },
    ]},
    '=======',
    { path: '/locations' },
    { path: '/external-persons' },
    { path: '/external-organizations' },
    { path: '/subject-groups' },
    { path: '/study-topics' },
    { path: '/helper-sets' },
    { path: '/personnel' },
    '=======',
    { path: '/research-groups' },
    { path: '/system-roles' },
    { path: '/custom-record-types' },
    { path: '/api-keys' },
    { path: '/audit' },
];

module.exports = nav;
