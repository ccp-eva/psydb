var common = {
    enableMigrationMode: false,
    i18n: {
        enableI18NSelect: true,
        defaultLanguage: 'en',
        defaultLocaleCode: 'en-US',
    },
    twoFactorAuth: { // FIXME: rename twoFactorAuth
        isEnabled: false,
    },
    apiKeyAuth: {
        isEnabled: true,
        allowedIps: [ '::/0' ]
    },

    branding: require('./psydb-default-branding'),
    disableLogoOverlay: false,
    dev_enableStagingBanner: true,
    dev_enableDevPanel: false,
    dev_copyNoticeGreyscale: true,
    
    dev_enableDangerousCRTFieldOps: true,

    dev_enableSubjectDuplicatesSearch: false,
    dev_subjectDuplicatesSearchFields: {}
}

var apedb = {
    ...common,
    enabledLabMethods: [
        'apestudies-wkprc-default',
    ],
    
    dev_enableWKPRCPatches: true,
    dev_showDummyRecordsAsTopOptions: true,
    dev_enableCSVParticipationImport: true,
    
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
}

var mpiccp = {
    ...common,
    enabledLabMethods: [
        'inhouse',
        'away-team',
        'online-video-call',
        //'online-survey',
        'manual-only-participation'
    ],
    dev_enableStatistics: true,
    dev_enableCSVSubjectImport: true,
    dev_enableCSVParticipationImport: true,

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
        ],
        'fs_namibia_subject': [
            '/gdpr/state/custom/name',
            '/scientific/state/custom/dateOfBirth'
        ]
    },
    dev_enableSubjectCopyForUnprocessedExperiments: true,
}

var humankind = {
    ...common,
    dev_enableForeignIdRefLinkInForms: false,
    
    dev_enableCSVSubjectImport: true,
    dev_enableCSVParticipationImport: true,
    dev_enableCSVSubjectContactHistoryImport: true,

    dev_enableImprovedContactTracking: true,
    dev_enableStudyConsentWorkflow: true,
    dev_enableStudyRoadmap: true,
    
    enabledLabMethods: [
        'inhouse',
        'away-team',
    ],
}

module.exports = apedb;
