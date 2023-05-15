'use strict';
var { entries, ejson } = require('@mpieva/psydb-core-utils');

var emailify = (str) => {
    return 'test_kind_' + str.toLowerCase() + '@example.com';
}

module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var researchGroupId = cache.get('/researchGroup/ChildLab');
    var kigaId = cache.get('/location/kiga/Wunderland');
    var acquisitionId = cache.get('/helperSetItem/acquisition/Ordnungsamt');
    var germanLangId = cache.get('/helperSetItem/language/Deutsch');
    var englishLangId = cache.get('/helperSetItem/language/Englisch');

    var baseData = [
        { firstname: 'Alice', biologicalGender: 'female' },
        { firstname: 'Bob', biologicalGender: 'male' },
        { firstname: 'Charlie', biologicalGender: 'male' },
        { firstname: 'Mallory', biologicalGender: 'female' },
    ];

    for (var [ix, it] of entries(baseData)) {
        var { firstname, biologicalGender } = it;
        await driver.sendMessage({
            type: 'subject/child/create',
            payload: { props: {
                gdpr: {
                    custom: {
                        firstname,
                        lastname: 'Test Kind',
                        mothersName: '',
                        fathersName: '',
                        address: {
                            affix: '',
                            housenumber: String(ix),
                            street: 'Teststrasse',
                            city: 'Leipzig',
                            postcode: '04103',
                            country: 'DE',
                        },
                        emails: [
                            { email: emailify(firstname), isPrimary: true }
                        ],
                        phones: [],
                    }
                },
                scientific: {
                    custom: {
                        dateOfBirth: '2001-01-01T00:00:00.000Z',
                        biologicalGender,
                        consentcard: 'yes',
                        allowedToEat: 'yes',
                        isMultiBirth: 'yes',
                        languages: [
                            germanLangId,
                            englishLangId,
                        ],
                        kigaId: kigaId,
                        weightAtBirth: null,
                        weekOfPregnancy: null,
                        acquisitions: [
                            acquisitionId
                        ] 
                    },
                    comment: '',
                    testingPermissions: [
                        { researchGroupId, permissionList: [
                            {
                                labProcedureTypeKey: 'inhouse',
                                value: 'yes'
                            },
                            {
                                labProcedureTypeKey: 'online-video-call',
                                value: 'yes'
                            },
                            {
                                labProcedureTypeKey: 'away-team',
                                value: 'yes'
                            },
                            {
                                labProcedureTypeKey: 'online-survey',
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
            collection: 'subject', recordType: 'child', as: firstname
        });
    }
}



