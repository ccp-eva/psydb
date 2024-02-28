'use strict';
var { flatten, unflatten } = require('@mpieva/psydb-core-utils');

// XXX: read via self?
var researchGroupId = "65de89c8840da54724b09531";

var createSubjectsInPsydb = async (context, next) => {
    var { driver, mails } = context;

    //try {
    //    await run({ driver, mails, dry: true });
          await run({ driver, mails });
    //}
    //catch (e) {
    //    // TODO
    //}

    await next();
}

var run = async (bag) => {
    var { driver, mails } = bag;

    for (var it of mails) {
        var { seq, adultData, childrenData } = it;
        
        var parentId = await createOneAdult({ driver, data: adultData });
        console.log(parentId);

        for (var it of childrenData) {
            await createOneChild({
                driver,
                parentId,
                siblingCount: (childrenData.length - 1),
                data: it
            });
        }
    }

}

var createOneAdult = async (bag) => {
    var { driver, data } = bag;

    var staticProps = flatten({
        gdpr: { custom: { address: { country: 'DE' }}},
        scientific: {
            custom: {
                dateOfBirth: '1970-01-01T00:00:00.000Z', // XXX
                doesDBRegistrationConsentOnPaperExist: false,
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
    });

    var props = unflatten({
        ...staticProps,
        ...data,
    });

    await driver.sendMessage({
        type: 'subject/humankindAdult/create',
        payload: { props },
    }, { forceTZ: 'UTC' });
    
    var id = driver.getCache().lastChannelIds.subject;

    return id;
}

var createOneChild = async (bag) => {
    var { driver, parentId, siblingCount, data } = bag;

    var staticProps = flatten({
        scientific: {
            custom: {
                parentIds: [ parentId ], 
                siblingCount,

                doesDBRegistrationConsentOnPaperExist: false,
                canParticipateInStudiesWithHealthyChildren: true,
                hasAwayTeamTestingPermissionForNextYear: 'unknown',
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
                        value: 'unknown'
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
    })

    var props = unflatten({
        ...staticProps,
        ...data,
    });

    await driver.sendMessage({
        type: 'subject/humankindChild/create',
        payload: { props },
    }, { forceTZ: 'UTC' });
}

module.exports = createSubjectsInPsydb;
