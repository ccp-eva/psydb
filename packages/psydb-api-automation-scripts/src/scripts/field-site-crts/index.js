'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');

var createEthnologySet = require('./create-ethnology-set');
var createLocationCRT = require('./create-location-crt');
var createSubjectCRT = require('./create-subject-crt');
var createFSScientistRole = require('./create-fs-scientist-role');
var createResearchGroup = require('./create-research-group');
var createDummyScientist = require('./create-dummy-scientist');

var sites = [
    { type: 'camreoon', labelDE: 'Kamerun', labelEN: 'Cameroon' },
    { type: 'namibia', labelDE: 'Namibia', labelEN: 'Namibia' },
    { type: 'congo', labelDE: 'Kongo', labelEN: 'Congo' },
    { type: 'malaysia', labelDE: 'Malaysia', labelEN: 'Malaysia' }
];
var defaultSubjectFormOrder = [
    '/sequenceNumber',
    '/gdpr/state/custom/name',
    '/scientific/state/custom/dateOfBirth',
    '/scientific/state/custom/isDateOfBirthReliable',
    '/scientific/state/custom/ethnologyId',
    '/scientific/state/custom/mainLocationId',
    '/scientific/state/comment',
]

module.exports = async (bag) => {
    var { driver, apiKey, extraOptions } = bag;
    var cache = {};

    var systemRoleId = await createFSScientistRole({ apiKey, driver });
    console.log({ systemRoleId });

    for (var site of sites) {
        var shared = { apiKey, driver, site };
        
        var ethnologySetId = await createEthnologySet({ ...shared });
        console.log({ ethnologySetId })
        
        var locationCrtId = await createLocationCRT({ ...shared });
        console.log({ locationCrtId })

        var subjectCrtId = await createSubjectCRT({
            ...shared,
            ethnologySetId,
            locationCrtId,
            formOrder: defaultSubjectFormOrder,
        });
        console.log({ subjectCrtId })

        var researchGroupId = await createResearchGroup({ ...shared });
        console.log({ researchGroupId })

        var userId = await createDummyScientist({
            ...shared,
            systemRoleId,
            researchGroupId,
        });
        console.log({ userId })

        cache[site.type] = {
            ethnologySetId,
            locationCrtId,
            subjectCrtId,
            researchGroupId,
            userId,
        };
    }

    await createCongoSpecialFields({
        driver, apiKey, subjectCrtId: cache['congo'].subjectCrtId
    });

    console.dir(ejson(
        driver.getCache().lastChannelIds
    ), { depth: null });
}


var createCongoSpecialFields = async ({ driver, apiKey, subjectCrtId }) => {

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: subjectCrtId, subChannelKey: 'scientific', props: {
            type: 'ListOfObjects',
            key: 'residenceHistory',
            displayName: 'Residences',
            displayNameI18N: { de: 'Wohnorte' },
            props: {
                minItems: 0,
                fields: [
                    {
                        type: 'DateTime',
                        key: 'timestamp',
                        displayName: 'Date/Time',
                        displayNameI18N: { de: 'Zeitpunkt' },
                        props: {
                            isNullable: false,
                            isSpecialAgeFrameField: false,
                        }
                    },
                    {
                        type: 'SaneString',
                        key: 'householdNumber',
                        displayName: 'Household Number',
                        displayNameI18N: { de: 'Haushaltsnummer' },
                        props: {
                            minLength: 1,
                        }
                    }
                ]
            },
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/commit-settings`,
        payload: { id: subjectCrtId }
    }, { apiKey });
    
    var formOrder = [ ...defaultSubjectFormOrder ];
    formOrder.splice(-1, 0, '/scientific/state/custom/residenceHistory');
    await driver.sendMessage({
        type: `custom-record-types/set-form-order`,
        payload: { id: subjectCrtId, formOrder }
    }, { apiKey });
}
