'use strict';
var { entries } = require('@mpieva/psydb-core-utils');

module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var researchGroupId = cache.get('/researchGroup/ChildLab');

    var baseData = [
        { name: 'Test-Kiga-Dachverband', shorthand: 'TKD' },
    ];

    for (var [ix, it] of entries(baseData)) {
        var { name, shorthand } = it;
        await driver.sendMessage({
            type: 'externalOrganization/kigaUmbrellaOrg/create',
            payload: { props: {
                custom: {
                    name,
                    shorthand,
                    contactPerson: '',
                    address: {
                        affix: '',
                        housenumber: '123',
                        street: 'Verbandsplatz',
                        city: 'Leipzig',
                        postcode: '04103',
                        country: 'DE',
                    },
                    emails: [],
                    phones: [],
                    faxes: [],
                    description: '',
                },
                systemPermissions: {
                    isHidden: false,
                    accessRightsByResearchGroup: [
                        { researchGroupId, permission: 'write' }
                    ]
                }
            }},
        }, { apiKey });

        cache.addId({
            collection: 'externalOrganization',
            recordType: 'kigaUmbrellaOrg',
            as: shorthand
        });
    }
}



