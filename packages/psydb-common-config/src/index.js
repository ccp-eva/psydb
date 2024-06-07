module.exports = {
    enableMigrationMode: false,
    i18n: {
        enableI18NSelect: true,
        defaultLanguage: 'en',
        defaultLocaleCode: 'en-US',
    },
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
    branding: 'humankind',
    disableLogoOverlay: true,
    
    dev_enableStagingBanner: true,
    dev_enableDevPanel: false,
    dev_copyNoticeGreyscale: false,
    dev_enableForeignIdRefLinkInForms: true,
}
