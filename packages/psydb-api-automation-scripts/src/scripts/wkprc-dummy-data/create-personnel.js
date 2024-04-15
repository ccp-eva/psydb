'use strict';
var emailify = (str) => {
    return 'test_wkprc_' + str.toLowerCase() + '@example.com';
}

module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var researchGroupId = cache.get('/researchGroup/WKPRC');

    for (var it of ['RA', 'Scientist']) {
        var systemRoleId = cache.get(`/systemRole/WKPRC ${it}`);

        await driver.sendMessage({
            type: 'personnel/create',
            payload: { props: {
                gdpr: {
                    firstname: `Test ${it}`,
                    lastname: 'WKPRC',
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

    for (var it of ['Alice', 'Bob', 'Charlie', 'Mallory']) {
        await driver.sendMessage({
            type: 'personnel/create',
            payload: { props: {
                gdpr: {
                    firstname: it,
                    lastname: 'WKPRC Experimenter',
                    emails: [
                        { email: emailify(it), isPrimary: true },
                    ],
                    phones: [],
                    description: 'Dummy Account',
                },
                scientific: {
                    canLogIn: false,
                    hasRootAccess: false,
                    researchGroupSettings: [],
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

        cache.addId({ collection: 'personnel', as: it });
    }
}



