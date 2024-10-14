'use strict';
var { entries } = require('@mpieva/psydb-core-utils');

module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var researchGroupId = cache.get('/researchGroup/WKPRC');

    var baseData = [
        { locationName: 'Chimfushi Sanctuary', groups: [
            { subjectType: 'wkprc_chimpanzee', name: 'G1' },
            { subjectType: 'wkprc_chimpanzee', name: 'G2' },
            { subjectType: 'wkprc_bonobo', name: 'G1' },
        ]},
        { locationName: 'Zoo Leipzig', groups: [
            { subjectType: 'wkprc_chimpanzee', name: 'Gruppe A' },
            { subjectType: 'wkprc_chimpanzee', name: 'Gruppe B' },
        ]},
        { locationName: 'Zoo Rostock', groups: [] },
    ];

    for (var location of baseData) {
        var { locationName, groups } = location;
        
        var locationId = cache.get(
            `/location/wkprc_apeLocation/${locationName}`
        );

        for (var group of groups) {
            var { name, subjectType } = group;
            await driver.sendMessage({
                type: 'subjectGroup/create',
                payload: {
                    subjectType,
                    props: {
                        name,
                        locationType: 'wkprc_apeLocation',
                        locationId,
                        comment: '',
                        systemPermissions: {
                            isHidden: false,
                            accessRightsByResearchGroup: [
                                { researchGroupId, permission: 'write' }
                            ]
                        }
                    }
                }
            }, { apiKey });

            cache.addId({
                collection: 'subjectGroup',
                as: `${subjectType} ${name}`
            });
        }
    }
}



