'use strict';
var emailify = (str) => {
    return 'test_childlab_' + str.toLowerCase() + '@example.com';
}

module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var researchGroupId = cache.get('/researchGroup/ChildLab');

    for (var it of ['RA', 'Scientist', 'Hiwi', 'Reception']) {
        var systemRoleId = cache.get(`/systemRole/ChildLab ${it}`);

        await driver.sendMessage({
            type: 'personnel/create',
            payload: { props: {
                gdpr: {
                    firstname: `Test ${it}`,
                    lastname: 'ChildLab',
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
        var systemRoleId = cache.get(`/systemRole/ChildLab Hiwi`);

        await driver.sendMessage({
            type: 'personnel/create',
            payload: { props: {
                gdpr: {
                    firstname: it,
                    lastname: 'ChildLab Experimenter',
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



