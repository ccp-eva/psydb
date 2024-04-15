'use strict';

var emailify = ({ firstname, lastname }) => {
    var sane = (s) => s.toLowerCase().replace(/\s+/g, '_')
    return sane(lastname) + '_' + sane(firstname) + '@example.com';
}

module.exports = async (context) => {
    var { apiKey, driver, cache, data } = context;
    var { groups, firstname, lastname, canLogIn } = data;

    await driver.sendMessage({
        type: 'personnel/create',
        payload: { props: {
            gdpr: {
                firstname: firstname,
                lastname: lastname,
                emails: [{
                    email: emailify({ firstname, lastname }),
                    isPrimary: true
                }],
                phones: [],
                description: 'Dummy Account',
            },
            scientific: {
                canLogIn: canLogIn,
                hasRootAccess: false,
                researchGroupSettings: (
                    groups
                    .filter(it => !!it.systemRoleId)
                    .map(it => ({
                        researchGroupId: it.researchGroupId,
                        systemRoleId: it.systemRoleId
                    }))
                ),
                systemPermissions: {
                    isHidden: false,
                    accessRightsByResearchGroup: (
                        groups
                        .filter(it => !!it.permission)
                        .map(it => ({
                            researchGroupId: it.researchGroupId,
                            permission: it.permission
                        }))
                    ),
                }
            }
        }},
    }, { apiKey });

    var personnelId = cache.addId({
        collection: 'personnel',
        as: `${lastname}, ${firstname}`,
    });

    await driver.sendMessage({
        type: 'set-personnel-password',
        payload: {
            id: personnelId,
            method: 'manual',
            password: 'test1234',
            sendMail: false,
        },
    }, { apiKey });

    return personnelId;
}
