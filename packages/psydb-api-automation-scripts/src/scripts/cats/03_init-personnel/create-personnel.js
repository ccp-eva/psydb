'use strict';
var { range } = require('@mpieva/psydb-core-utils');
var { FakeRecords, Fields } = require('@mpieva/psydb-faker');
var { seedFakerForNextId } = require('../../../utils');

module.exports = async (context) => {
    var { driver, refcache, ids, idgen } = context;
   
    var fixed = [
        { firstname: 'Test', lastname: 'Cat-RA',
            manualImportId: 'CATRA',
            canLogIn: true, systemRole: 'Cat RA' },

        { firstname: 'Test', lastname: 'Cat-Scientist',
            manualImportId: 'CATSCI',
            canLogIn: true, systemRole: 'Cat Scientist' },
    ];

    for (var it of fixed) {
        var { firstname, lastname, manualImportId, canLogIn, systemRole } = it;
        seedFakerForNextId({ idgen, collection: 'personnel' });

        var faked = FakeRecords['personnel']({
            refcache: refcache.data(), overrides: {
                '/gdpr/state/firstname': firstname,
                '/gdpr/state/lastname': lastname,
                '/gdpr/state/emails': [{
                    'email': emailify({ firstname, lastname }),
                    'isPrimary': true
                }],
                '/scientific/state/manualImportId': manualImportId,
                '/scientific/state/canLogIn': true,
                '/scientific/state/hasRootAccess': false,
                '/scientific/state/researchGroupSettings': [{
                    'researchGroupId': ids('Cat-Lab'),
                    'systemRoleId': ids(systemRole),
                }],
                '/scientific/stat/systemPermissions/accessRightsByResearchGroup': [{
                    researchGroupId: ids('Cat-Lab'),
                    permission: 'write',
                }],
            }
        });

        await driver.personnel.create({ data: faked });
    }
  
    for (var ix of range(20)) {
        seedFakerForNextId({ idgen, collection: 'personnel' });
        var faked = FakeRecords['personnel']({
            refcache: refcache.data(), overrides: {
                '/gdpr/state/description': Fields.SaneString(),
            }
        });
        var { firstname, lastname } = faked.gdpr.state;
        faked.scientific.state.manualImportId = initialify({
            firstname, lastname
        });
        await driver.personnel.create({ data: faked });
    }
    
}

// NOTE: i.e. Tom Bombadil => ToBo
var initialify = ({ firstname, lastname }) => (
    firstname.slice(0, 2) + lastname.slice(0, 2)
);

var emailify = ({ firstname, lastname }) => {
    var sane = (s) => s.toLowerCase().replace(/\s+/g, '_')
    return sane(lastname) + '_' + sane(firstname) + '@example.com';
}
