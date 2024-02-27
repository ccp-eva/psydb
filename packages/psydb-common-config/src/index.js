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
    twoFactorAuthentication: { // FIXME: rename twoFactorAuth
        isEnabled: false,
    },
    apiKeyAuth: {
        isEnabled: true,
        allowedIps: [ '::/0' ]
    }
}
