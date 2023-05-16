'use strict';
var { entries } = require('@mpieva/psydb-core-utils');
var { Duration } = require('@mpieva/psydb-common-lib/src/durations');

module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var researchGroupId = cache.get('/researchGroup/ChildLab');
    var supervisorId = cache.get('/personnel/RA');
    var kigaUmbrellaOrgId = (
        cache.get('/externalOrganization/kigaUmbrellaOrg/TKD')
    );

    var baseData = [
        { name: 'Blume'  },
        { name: 'Pinguin'  },
        { name: 'Giraffe' },
    ];

    for (var [ix, it] of entries(baseData)) {
        var { name } = it;
        await driver.sendMessage({
            type: 'location/instituteroom/create',
            payload: { props: {
                custom: {
                    name,
                    number: 'R.' + String(ix),
                },
                comment: '',
                reservationSettings: {
                    canBeReserved: true,
                    possibleReservationWeekdays: {
                        mon: true,
                        tue: true,
                        wed: true,
                        thu: true,
                        fri: true,
                        sat: true,
                        sun: true,
                    },
                    possibleReservationTimeInterval: {
                        start: Duration('08:00:00'), // => 6:00 local
                        end: Duration('18:00:00'), // => 4:00 local
                    },
                    reservationSlotDuration: Duration('0:15'),
                    timezone: 'Europe/Berlin',
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
            recordType: 'instituteroom',
            as: name
        });
    }
}



