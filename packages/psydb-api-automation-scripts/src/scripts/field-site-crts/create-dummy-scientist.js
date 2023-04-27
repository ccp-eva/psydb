'use strict';
var emailify = (str) => {
    return str.toLowerCase() + '_scientist@example.com';
}

var createResearchGroup = async (bag) => {
    var {
        apiKey, driver, site, researchGroupId, systemRoleId
    } = bag;

    await driver.sendMessage({
        type: 'personnel/create',
        payload: { props: {
            gdpr: {
                firstname: 'Test Scientist',
                lastname: site.label,
                emails: [
                    { email: emailify(site.label), isPrimary: true },
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
                        { researchGroupId, permission: 'read' }
                    ]
                }
            }
        }},
    }, { apiKey });
    var personnelId = driver.getCache().lastChannelIds['personnel'];

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

module.exports = createResearchGroup;



