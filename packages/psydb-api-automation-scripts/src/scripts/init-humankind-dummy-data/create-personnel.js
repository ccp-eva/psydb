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

    var staticAccounts = [
        { firstname: 'K', lastname: 'R', email: 'k.r@uni-leipzig.de' },
        { firstname: 'A', lastname: 'G', email: 'a.g@uni-leipzig.de' },
        { firstname: 'J', lastname: 'S', email: 'j.s@uni-leipzig.de' },
    ]
    for (var it of staticAccounts) {
        var { firstname, lastname, email } = it;
        var systemRoleId = cache.get(`/systemRole/Humankind RA`);

        await driver.sendMessage({
            type: 'personnel/create',
            payload: { props: {
                gdpr: {
                    firstname,
                    lastname,
                    emails: [
                        { email, isPrimary: true },
                    ],
                    phones: [],
                    description: '',
                },
                scientific: {
                    canLogIn: true,
                    hasRootAccess: true,
                    researchGroupSettings: [
                        { researchGroupId, systemRoleId }
                    ],
                    systemPermissions: {
                        isHidden: false,
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



