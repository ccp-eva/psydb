'use strict';
var { entries, ejson } = require('@mpieva/psydb-core-utils');

module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var researchGroupId = cache.get('/researchGroup/WKPRC');
    var locationId = cache.get(
        '/location/wkprc_ape_location/Chimfushi Sanctuary'
    );
    var subjectGroupId = cache.get(
        '/subjectGroup/wkprc_chimpanzee G1'
    );

    var baseData = [
        { name: 'Jaro', biologicalGender: 'male' },
        { name: 'Star', biologicalGender: 'female' },
    ];

    for (var [ix, it] of entries(baseData)) {
        var { name, biologicalGender } = it;
        var wkprcIdCode = (
            'C_' + name.substr(0, 3).toUpperCase() + '_123456'
        );
        await driver.sendMessage({
            type: 'subject/wkprc_chimpanzee/create',
            payload: { props: {
                gdpr: { custom: {}},
                scientific: {
                    custom: {
                        name: name,
                        biologicalGender: biologicalGender,
                        wkprcIdCode: wkprcIdCode,
                        dateOfBirth: '2001-01-01T00:00:00.000Z',
                        subSpeciesId: null,
                        motherId: null,
                        fatherId: null,
                        groupId: subjectGroupId,
                        rearingHistoryId: null,
                        originId: null,
                        arrivalDate: null,
                        arrivedFrom: '',
                        locationId: locationId,
                        sensitiveComment: 'possibly sensitive information',
                    },
                    comment: 'some information',
                    systemPermissions: {
                        isHidden: false,
                        accessRightsByResearchGroup: [
                            { researchGroupId, permission: 'write' }
                        ]
                    }
                }
            }},
        }, { apiKey });

        cache.addId({
            collection: 'subject', recordType: 'wkprc_chimpanzee', as: name
        });
    }
}



