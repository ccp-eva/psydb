module.exports = {
    enableMigrationMode: false,
    i18n: {
        enableI18NSelect: true,
        defaultLanguage: 'en',
        defaultLocaleCode: 'en-US',
    },

    // apedb
    sideNav: [
        { path: '/csv-imports' },
        { path: '/subjects' },
        { path: '/studies' },
        '=======',
        { path: '/locations' },
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
    ],
    
    enabledLabMethods: [
        'inhouse',
        'away-team',
        'online-video-call',
        'online-survey',
        'apestudies-wkprc-default',
        'manual-only-participation'
    ],
    twoFactorAuth: { // FIXME: rename twoFactorAuth
        isEnabled: false,
    },
    apiKeyAuth: {
        isEnabled: true,
        allowedIps: [ '::/0' ]
    },
    //branding: 'sunway',
    //disableLogoOverlay: true,
    branding: require('./psydb-default-branding'),
    disableLogoOverlay: false,

    dev_enableStagingBanner: true,
    dev_enableDevPanel: false,
    dev_copyNoticeGreyscale: true,
    //dev_enableForeignIdRefLinkInForms: true,

    dev_enableDangerousCRTFieldOps: true,
    
    dev_enableCSVSubjectImport: true,
    dev_enableCSVParticipationImport: true,
    
    dev_enableStatistics: true,
    dev_showDummyRecordsAsTopOptions: true,
    dev_enableWKPRCPatches: false,

    dev_enableSubjectDuplicatesSearch: true,
    dev_subjectDuplicatesSearchFields: {
        'child': [
            '/gdpr/state/custom/lastname',
            '/gdpr/state/custom/firstname',
            [
                '/gdpr/state/custom/fathersName',
                '/gdpr/state/custom/lastname'
            ],
            [
                '/gdpr/state/custom/mothersName',
                '/gdpr/state/custom/lastname'
            ],
            '/gdpr/state/custom/emails', // TODO: min 1
            '/gdpr/state/custom/phones',
            '/gdpr/state/custom/address', // includes only street and number
            '/scientific/state/custom/dateOfBirth'
        ]
    }
}
