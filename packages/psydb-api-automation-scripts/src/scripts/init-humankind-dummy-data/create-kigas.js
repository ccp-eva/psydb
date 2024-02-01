'use strict';
var { entries } = require('@mpieva/psydb-core-utils');

module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var researchGroupId = cache.get('/researchGroup/Humankind');
    var supervisorId = cache.get('/personnel/RA');
    var kigaUmbrellaOrgId = (
        cache.get('/externalOrganization/kigaUmbrellaOrg/TKD')
    );

    var baseData = [
        { name: 'Sonnenschein'  },
        { name: 'Wunderland'  },
    ];

    for (var [ix, it] of entries(baseData)) {
        var { name, shorthand } = it;
        await driver.sendMessage({
            type: 'location/kiga/create',
            payload: { props: {
                custom: {
                    name,
                    address: {
                        affix: '',
                        housenumber: String(ix),
                        street: 'Kigaweg',
                        city: 'Leipzig',
                        postcode: '04103',
                        country: 'DE',
                    },
                    head: '',
                    vice: '',
                    emails: [],
                    phones: [],
                    faxes: [],
                    supervisorId,
                    kigaUmbrellaOrgId,
                    roomInfo: 'Raum ist gross und hell.',
                },
                reservationSettings: {
                    canBeReserved: false,
                    excludedExperimentWeekdays: {
                        mon: false,
                        tue: false,
                        wed: false,
                        thu: false,
                        fri: false,
                        sat: false,
                        sun: false,
                    },
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
            collection: 'location',
            recordType: 'kiga',
            as: name
        });
    }
}



