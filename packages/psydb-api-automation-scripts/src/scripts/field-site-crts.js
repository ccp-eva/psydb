'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');

var apiKey = [
    'xA3S5M1_2uEhgelRVaZyYjg5qw_UehHV',
    'B1bGmH9X7-S8x8sslsUxIFH5_n85Tkdh'
].join('');

var sites = [
    { type: 'camreoon', label: 'Kamerun' },
    { type: 'namibia', label: 'Namibia' },
    { type: 'congo', label: 'Kongo' },
    { type: 'malaysia', label: 'Malaysia' }
];
var defaultSubjectFormOrder = [
    '/sequenceNumber',
    '/gdpr/state/custom/name',
    '/scientific/state/custom/dateOfBirth',
    '/scientific/state/custom/isDateOfBirthReliable',
    '/scientific/state/custom/ethnologyId',
    '/scientific/state/custom/defaultLocationId',
    '/scientific/state/comment',
]

module.exports = async (bag) => {
    var { driver } = bag;
    var cache = {};

    for (var site of sites) {
        var shared = { driver, site };
        
        var ethnologyId = await createEthnologySet({ ...shared });
        console.log({ ethnologyId })
        
        var locationCrtId = await createLocationType({ ...shared });
        console.log({ locationCrtId })

        var subjectCrtId = await createSubjectType({
            ...shared, ethnologyId, locationCrtId,
        });
        console.log({ subjectCrtId })

        cache[site] = {
            ethnologyId,
            locationCrtId,
            subjectCrtId
        };
    }

    await createCongoSpecialFields({
        driver, subjectCrtId
    });

    console.dir(ejson(
        driver.getCache().lastChannelIds
    ), { depth: null });
}



var createEthnologySet = async ({ driver, site }) => {
    await driver.sendMessage({
        type: 'helperSet/create',
        payload: { props: { label: `FS ${site.label} Ethnie` }},
    }, { apiKey })
    return driver.getCache().lastChannelIds['helperSet'];
}



var createLocationType = async ({ driver, site }) => {
    var label = `FS ${site.label} Location`;

    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'location',
            type: `fs_${site.type}_location`,
            props: { label }
        },
    }, { apiKey });

    var crtId = driver.getCache().lastChannelIds['customRecordType'];

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'name',
            displayName: 'Name',
            props: { minLength: 1 }
        }},
    }, { apiKey });
 
    await driver.sendMessage({
        type: `custom-record-types/commit-settings`,
        payload: { id: crtId }
    }, { apiKey });


    await driver.sendMessage({
        type: `custom-record-types/set-record-label-definition`,
        payload: { id: crtId, props: {
            format: '${#}',
            tokens: [
                '/state/custom/name',
            ]
        }}
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-display-fields`,
        payload: {
            id: crtId,
            target: 'table',
            fieldPointers: [
                '/sequenceNumber',
                '/state/custom/name',
            ]
        }
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/set-display-fields`,
        payload: {
            id: crtId,
            target: 'optionlist',
            fieldPointers: [
                '/sequenceNumber',
                '/state/custom/name',
            ]
        }
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-general-data`,
        payload: {
            id: crtId,
            label,
            reservationType: 'away-team',
        }
    }, { apiKey });

    return crtId;
}



var createSubjectType = async ({ driver, site, ethnologyId }) => {
    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'subject',
            type: `fs_${site.type}_subject`,
            props: { label: `FS ${site.label} Probanden` }
        },
    }, { apiKey });

    var crtId = driver.getCache().lastChannelIds['customRecordType'];

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'gdpr', props: {
            type: 'SaneString',
            key: 'name',
            displayName: 'Name',
            props: { minLength: 1 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'DateOnlyServerSide',
            key: 'dateOfBirth',
            displayName: 'Geburtsdatum',
            props: { isNullable: false, isSpecialAgeFrameField: true }
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'DefaultBool',
            key: 'isDateOfBirthReliable',
            displayName: 'Geburtsdatum gesichert',
            props: {},
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'HelperSetItemId',
            key: 'ethnologyId',
            displayName: 'Ethnie',
            props: {
                setId: ethnologyId,
                isNullable: true,
            },
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'ForeignId',
            key: 'defaultLocationId',
            displayName: 'Standard-Location',
            props: {
                collection: 'location',
                recordType: `fs_${site.type}_location`,
                isNullable: true,
                constraints: {},
            },
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/commit-settings`,
        payload: { id: crtId }
    }, { apiKey });


    await driver.sendMessage({
        type: `custom-record-types/set-record-label-definition`,
        payload: { id: crtId, props: {
            format: '${#} (ID: ${#})',
            tokens: [
                '/gdpr/state/custom/name',
                '/sequenceNumber'
            ]
        }}
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-display-fields`,
        payload: {
            id: crtId,
            target: 'table',
            fieldPointers: [
                '/sequenceNumber',
                '/gdpr/state/custom/name',
                '/scientific/state/custom/dateOfBirth',
            ]
        }
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/set-display-fields`,
        payload: {
            id: crtId,
            target: 'optionlist',
            fieldPointers: [
                '/sequenceNumber',
                '/gdpr/state/custom/name',
                '/scientific/state/custom/dateOfBirth',
            ]
        }
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-form-order`,
        payload: { id: crtId, formOrder: defaultSubjectFormOrder }
    }, { apiKey });

    return crtId;
}

var createCongoSpecialFields = async ({ driver, subjectCrtId }) => {

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: subjectCrtId, subChannelKey: 'scientific', props: {
            type: 'ListOfObjects',
            key: 'residenceHistory',
            displayName: 'Wohnorte',
            props: {
                minItems: 0,
                fields: [
                    {
                        type: 'DateTime',
                        key: 'timestamp',
                        displayName: 'Zeipunkt',
                        props: {
                            isNullable: false,
                            isSpecialAgeFrameField: false,
                        }
                    },
                    {
                        type: 'SaneString',
                        key: 'householdNumber',
                        displayName: 'Haushaltsnummer',
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
