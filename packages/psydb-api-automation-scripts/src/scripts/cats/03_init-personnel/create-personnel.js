'use strict';
var { range } = require('@mpieva/psydb-core-utils');
var { FakeRecords, Fields } = require('@mpieva/psydb-faker');

module.exports = async (context) => {
    var { driver, cache } = context;
    var { refcache } = cache.get();
   
    var fixed = [
        { firstname: 'Test', lastname: 'Cat-RA',
            canLogIn: true, systemRole: 'Cat RA' },

        { firstname: 'Test', lastname: 'Cat-Scientist',
            canLogIn: true, systemRole: 'Cat Scientist' },
    ];

    for (var it of fixed) {
        var { firstname, lastname, canLogIn, systemRole } = it;

        var faked = FakeRecords['personnel']({ refcache, overrides: {
            '/gdpr/state/firstname': firstname,
            '/gdpr/state/lastname': lastname,
            '/gdpr/state/emails': [{
                'email': emailify({ firstname, lastname }),
                'isPrimary': true
            }],
            '/scientific/state/canLogIn': true,
            '/scientific/state/hasRootAccess': false,
            '/scientific/state/researchGroupSettings': [{
                'researchGroupId': cache.get('/researchGroup/Cat-Lab'),
                'systemRoleId': cache.get(`/systemRole/${systemRole}`)
            }],
            '/scientific/stat/systemPermissions/accessRightsByResearchGroup': [{
                researchGroupId: cache.get('/researchGroup/Cat-Lab'),
                permission: 'write',
            }],
        }});

        await driver.personnel.create({ data: faked });

        cache.addId({
            collection: 'personnel',
            as: `${firstname} ${lastname}`
        });
    }
  
    for (var ix of range(20)) {
        var faked = FakeRecords['personnel']({ refcache, overrides: {
            '/gdpr/state/description': Fields.SaneString(),
        }});
        await driver.personnel.create({ data: faked });
    }
    
}

var emailify = ({ firstname, lastname }) => {
    var sane = (s) => s.toLowerCase().replace(/\s+/g, '_')
    return sane(lastname) + '_' + sane(firstname) + '@example.com';
}
