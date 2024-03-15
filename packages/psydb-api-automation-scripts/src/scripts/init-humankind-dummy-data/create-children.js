'use strict';
var { entries, ejson } = require('@mpieva/psydb-core-utils');

module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;

    var researchGroupId = cache.get('/researchGroup/Humankind');
    
    var Agatha = cache.get('/subject/humankindAdult/Agatha');
    var Bernard = cache.get('/subject/humankindAdult/Bernard');
    var Charles = cache.get('/subject/humankindAdult/Charles');
    var Monica = cache.get('/subject/humankindAdult/Monica');

    var German = cache.get('/helperSetItem/language/German');
    var English = cache.get('/helperSetItem/language/English');
    var Spanish = cache.get('/helperSetItem/language/Spanish');

    var baseData = [
        { firstname: 'Alice', gender: 'female',  parentIds: [
            Agatha, Bernard,
        ]},
        { firstname: 'Bob', gender: 'male', parentIds: [
            Agatha, Bernard,
        ]},
        { firstname: 'Charlie', gender: 'other', parentIds: [
            Charles, Monica,
        ]},
        { firstname: 'Mallory', gender: 'female', parentIds: [
            Charles, Monica,
        ]},
    ];

    for (var [ix, it] of entries(baseData)) {
        var { firstname, gender, parentIds } = it;
        await driver.sendMessage({
            type: 'subject/humankindChild/create',
            payload: { props: {
                gdpr: {
                    custom: {
                        firstname,
                        lastname: 'Test Child',
                    }
                },
                scientific: {
                    custom: {
                        parentIds, 
                        dateOfBirth: '2018-01-01T00:00:00.000Z',
                        gender,
                        siblingCount: 1,
                        nativeLanguageId: German,
                        otherLanguageIds: [
                            English, Spanish
                        ],
                        doesDBRegistrationConsentOnPaperExist: true,
                        canParticipateInStudiesWithHealthyChildren: true,
                        hasAwayTeamTestingPermissionForNextYear: 'unknown',
                        didConsentToStayInDBAsAdult: 'unknown',
                        allowedToEat: 'unknown',
                        kigaId: null,
                    },
                    comment: '',
                    testingPermissions: [
                        { researchGroupId, permissionList: [
                            {
                                labProcedureTypeKey: 'inhouse',
                                value: 'yes'
                            },
                            {
                                labProcedureTypeKey: 'away-team',
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
            collection: 'subject', recordType: 'humankindChild',
            as: firstname
        });
    }
}



