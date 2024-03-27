'use strict';
var { entries, ejson } = require('@mpieva/psydb-core-utils');

var emailify = (str) => {
    return 'test_adult_' + str.toLowerCase() + '@example.com';
}

module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var researchGroupId = cache.get('/researchGroup/Humankind');

    var baseData = [
        { firstname: 'Agatha', gender: 'female' },
        { firstname: 'Bernard', gender: 'other' },
        { firstname: 'Charles', gender: 'male' },
        { firstname: 'Monica', gender: 'female' },
    ];

    for (var [ix, it] of entries(baseData)) {
        var { firstname, gender } = it;
        await driver.sendMessage({
            type: 'subject/humankindAdult/create',
            payload: { props: {
                gdpr: {
                    custom: {
                        firstname,
                        lastname: 'Test Adult',
                        address: {
                            affix: '',
                            housenumber: String(ix),
                            street: 'Teststrasse',
                            city: 'Leipzig',
                            postcode: '04103',
                            country: 'DE',
                        },
                        email: emailify(firstname),
                        phones: [
                            `0341/12345600${ix}`
                        ],
                        dateOfBirth: '1980-01-01T00:00:00.000Z',
                        gender,
                    }
                },
                scientific: {
                    custom: {
                        doesDBRegistrationConsentOnPaperExist: true,
                        acquisitionId: null,
                    },
                    comment: '',
                    testingPermissions: [
                        { researchGroupId, permissionList: [
                            {
                                labProcedureTypeKey: 'inhouse',
                                value: 'yes'
                            },
                        ]}
                    ],
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
            collection: 'subject', recordType: 'humankindAdult',
            as: firstname
        });
    }
}



