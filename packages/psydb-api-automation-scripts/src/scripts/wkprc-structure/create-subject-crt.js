'use strict';

var createSubjectCRT = async (bag) => {
    var { apiKey, driver, cache, type, label } = bag;

    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'subject',
            type: `wkprc_${type}`,
            props: { label }
        },
    }, { apiKey });

    var crtId = cache.addId({ collection: 'customRecordType', as: type });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'SaneString',
            key: 'name',
            displayName: 'Name',
            props: { minLength: 1 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'SaneString',
            key: 'wkprcIdCode',
            displayName: 'WKPRC-ID-Code',
            props: { minLength: 0 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'BiologicalGender',
            key: 'biologicalGender',
            displayName: 'Sex',
            props: {
                enableUnknownValue: true,
            }
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'DateOnlyServerSide',
            key: 'dateOfBirth',
            displayName: 'Date of Birth',
            props: { isNullable: true, isSpecialAgeFrameField: true }
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'HelperSetItemId',
            key: 'subSpeciesId',
            displayName: 'Sub-Species',
            props: {
                setId: cache.get(`/helperSet/${type}SubSpecies`),
                isNullable: true,
                displayEmptyAsUnknown: true,
            },
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'HelperSetItemId',
            key: 'rearingHistoryId',
            displayName: 'Rearing History',
            props: {
                setId: cache.get('/helperSet/rearingHistory'),
                isNullable: true,
                displayEmptyAsUnknown: true,
            },
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'HelperSetItemId',
            key: 'originId',
            displayName: 'Origin',
            props: {
                setId: cache.get('/helperSet/origin'),
                isNullable: true,
                displayEmptyAsUnknown: true,
            },
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'DateOnlyServerSide',
            key: 'arrivalDate',
            displayName: 'Arrival Date',
            props: { isNullable: true, isSpecialAgeFrameField: false }
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'SaneString',
            key: 'arrivedFrom',
            displayName: 'Arrived From',
            props: { minLength: 0 }
        }},
    }, { apiKey });

    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'ForeignId',
            key: 'locationId',
            displayName: 'Location',
            props: {
                collection: 'location',
                recordType: 'wkprc_ape_location',
                isNullable: true,
                displayEmptyAsUnknown: true,
                addReferenceToTarget: false,
                constraints: {},
            },
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'ForeignId',
            key: 'motherId',
            displayName: 'Mother',
            props: {
                collection: 'subject',
                recordType: `wkprc_${type}`,
                isNullable: true,
                displayEmptyAsUnknown: true,
                addReferenceToTarget: true,
                targetReferenceField: (
                    '/scientific/state/custom/knownOffspringIds'
                ),
                constraints: {},
            },
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'ForeignId',
            key: 'fatherId',
            displayName: 'Father',
            props: {
                collection: 'subject',
                recordType: `wkprc_${type}`,
                isNullable: true,
                displayEmptyAsUnknown: true,
                addReferenceToTarget: true,
                targetReferenceField: (
                    '/scientific/state/custom/knownOffspringIds'
                ),
                constraints: {},
            },
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'ForeignIdList',
            key: 'knownOffspringIds',
            displayName: 'Known Offspring',
            props: {
                collection: 'subject',
                recordType: `wkprc_${type}`,
                minItems: 0,
                readOnly: true,
                constraints: {},
            },
        }},
    }, { apiKey });

    //await driver.sendMessage({
    //    type: `custom-record-types/add-field-definition`,
    //    payload: { id: crtId, subChannelKey: 'scientific', props: {
    //        type: 'SaneString',
    //        key: 'group',
    //        displayName: 'Group',
    //        props: { minLength: 0 }
    //    }},
    //}, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'ForeignId',
            key: 'groupId',
            displayName: 'Group',
            props: {
                collection: 'subjectGroup',
                isNullable: true,
                displayEmptyAsUnknown: true,
                addReferenceToTarget: false,
                constraints: {
                    '/subjectType': `wkprc_${type}`,
                    '/state/locationId': '$data:/scientific/state/custom/locationId'
                },
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
            format: '${#} (${#})',
            tokens: [
                '/scientific/state/custom/name',
                '/scientific/state/custom/wkprcIdCode',
            ]
        }}
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-display-fields`,
        payload: {
            id: crtId,
            target: 'table',
            fieldPointers: [
                '/scientific/state/custom/name',
                '/scientific/state/custom/wkprcIdCode',
                '/scientific/state/custom/biologicalGender',
                '/scientific/state/custom/dateOfBirth',
                '/scientific/state/custom/locationId',
                '/scientific/state/custom/groupId',
            ]
        }
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/set-display-fields`,
        payload: {
            id: crtId,
            target: 'optionlist',
            fieldPointers: [
                '/scientific/state/custom/name',
                '/scientific/state/custom/wkprcIdCode',
                '/scientific/state/custom/locationId',
                '/scientific/state/custom/groupId',
            ]
        }
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-form-order`,
        payload: { id: crtId, formOrder: [
            '/scientific/state/custom/name',
            '/scientific/state/custom/biologicalGender',
            '/scientific/state/custom/wkprcIdCode',
            '/scientific/state/custom/dateOfBirth',
            '/scientific/state/custom/subSpeciesId',
            '/scientific/state/custom/motherId',
            '/scientific/state/custom/fatherId',
            '/scientific/state/custom/knownOffspringIds',
            '/scientific/state/custom/locationId',
            '/scientific/state/custom/groupId',
            '/scientific/state/custom/rearingHistoryId',
            '/scientific/state/custom/originId',
            '/scientific/state/custom/arrivalDate',
            '/scientific/state/custom/arrivedFrom',
            '/scientific/state/comment',
        ]}
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-general-data`,
        payload: {
            id: crtId,
            label,
            requiresTestingPermissions: false,
            showOnlineId: false,
            showSequenceNumber: false,
            commentFieldIsSensitive: true,
        }
    }, { apiKey });

    return crtId;
}

module.exports = createSubjectCRT
