'use strict';

module.exports = async (bag) => {
    var { driver, cache, subjects } = bag;
    
    var researchGroupId = cache.get('/researchGroup/ChildLab');
    var acquisitionId = cache.get('/helperSetItem/Kindergarten');

    for (var [ ix, it ] of Object.entries(subjects)) {
        var { firstname, lastname } = it;

        //var blank = await driver.createBlankFromCRT({
        //    collection: 'subject', type: 'child',
        //});

        //var subject = override({ into: blank, values: {
        //    '/gdpr/state/custom/firstname'
        //}});

        //await driver.createSubject({ fromRecord: subject });
        
        await driver.sendMessage({
            type: 'subject/child/create',
            payload: { forceDuplicate: true, props: {
                gdpr: {
                    custom: {
                        firstname: firstname,
                        lastname: lastname,
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
                        emails: [],
                        phones: [],
                    }
                },
                scientific: {
                    custom: {
                        dateOfBirth: '2001-01-01T00:00:00.000Z',
                        biologicalGender: 'unknown',
                        consentcard: 'yes',
                        allowedToEat: 'yes',
                        isMultiBirth: 'yes',
                        languages: [],
                        kigaId: null,
                        weightAtBirth: null,
                        weekOfPregnancy: null,
                        acquisitions: [ acquisitionId ] 
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
        });
    }
}
