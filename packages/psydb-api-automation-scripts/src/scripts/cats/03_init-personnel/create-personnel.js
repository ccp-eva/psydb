'use strict';

module.exports = async (context) => {
    var { driver, cache } = context;
   
    var accounts = [
        { firstname: 'Test', lastname: 'Cat-RA',
            canLogIn: true, systemRole: 'Cat RA' },

        { firstname: 'Test', lastname: 'Cat-Scientist',
            canLogIn: true, systemRole: 'Cat Scientist' },
    ];

    for (var it of accounts) {
        var { firstname, lastname, canLogIn, systemRole } = it;

        await driver.personnel.create({ data: {
            gdpr: { state: {
                firstname: firstname,
                lastname: lastname,
                emails: [{
                    email: emailify({ firstname, lastname }),
                    isPrimary: true
                }],
                phones: [],
                description: 'Dummy Account',
            }},
            scientific: { state: {
                canLogIn: canLogIn,
                hasRootAccess: false,
                researchGroupSettings: [{
                    researchGroupId: cache.get('/researchGroup/Cat-Lab'),
                    systemRoleId: cache.get(`/systemRole/${systemRole}`)
                }],
                systemPermissions: {
                    isHidden: false,
                    accessRightsByResearchGroup: [{
                        researchGroupId: cache.get('/researchGroup/Cat-Lab'),
                        permission: 'write',
                    }],
                }
            }}
        }});
        
        cache.addId({
            collection: 'personnel',
            as: `${firstname} ${lastname}`
        });
    }
    
}

var emailify = ({ firstname, lastname }) => {
    var sane = (s) => s.toLowerCase().replace(/\s+/g, '_')
    return sane(lastname) + '_' + sane(firstname) + '@example.com';
}
