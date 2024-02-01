'use strict';
var emailify = (str) => {
    return 'dummy' + str.toLowerCase() + '@example.com';
}

module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var researchGroupId = cache.get('/researchGroup/Humankind');

    for (var it of ['RA', 'Scientist', 'Hiwi', 'Reception']) {
        var systemRoleId = cache.get(`/systemRole/Humankind ${it}`);

        await driver.sendMessage({
            type: 'personnel/create',
            payload: { props: {
                gdpr: {
                    firstname: `Test ${it}`,
                    lastname: 'Humankind',
                    emails: [
                        { email: emailify(it), isPrimary: true },
                    ],
                    phones: [],
                    description: 'Dummy Account',
                },
                scientific: {
                    canLogIn: true,
                    hasRootAccess: false,
                    researchGroupSettings: [
                        { researchGroupId, systemRoleId }
                    ],
                    systemPermissions: {
                        isHidden: false,
                        // FIXME: childlab should have read access
                        accessRightsByResearchGroup: [
                            { researchGroupId, permission: 'write' }
                        ]
                    }
                }
            }},
        }, { apiKey });

        var personnelId = cache.addId({ collection: 'personnel', as: it });

        await driver.sendMessage({
            type: 'set-personnel-password',
            payload: {
                id: personnelId,
                method: 'manual',
                password: 'test1234',
                sendMail: false,
            },
        }, { apiKey });
    }

}



