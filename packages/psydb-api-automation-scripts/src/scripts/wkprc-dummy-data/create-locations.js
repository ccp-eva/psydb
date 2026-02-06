'use strict';
var { entries } = require('@mpieva/psydb-core-utils');

module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var researchGroupId = cache.get('/researchGroup/WKPRC');

    var baseData = [
        { name: 'Chimfushi Sanctuary'  },
        { name: 'Zoo Leipzig'  },
        { name: 'Zoo Rostock'  },
    ];

    for (var [ix, it] of entries(baseData)) {
        var { name, shorthand } = it;
        await driver.sendMessage({
            type: 'location/wkprc_apeLocation/create',
            payload: { props: {
                custom: {
                    name,
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
            recordType: 'wkprc_apeLocation',
            as: name
        });
    }
}



