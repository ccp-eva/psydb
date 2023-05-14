'use strict';
module.exports = async (context) => {
    var { apiKey, driver, cache, as } = context;

    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'subject',
            type: 'child',
            props: { label: 'Kinder' }
        },
    }, { apiKey });

    var crtId = cache.addId({ collection: 'customRecordType', as });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'gdpr', props: {
            type: 'SaneString',
            key: 'firstname',
            displayName: 'Vorname',
            props: { minLength: 1 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'gdpr', props: {
            type: 'SaneString',
            key: 'lastname',
            displayName: 'Nachname',
            props: { minLength: 1 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'gdpr', props: {
            type: 'SaneString',
            key: 'mothersName',
            displayName: 'Mutter',
            props: { minLength: 0 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'gdpr', props: {
            type: 'SaneString',
            key: 'fathersName',
            displayName: 'Vater',
            props: { minLength: 0 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'gdpr', props: {
            type: 'Address',
            key: 'address',
            displayName: 'Adresse',
            props: {
                isStreetRequired: false,
                isHousenumberRequired: false,
                isAffixRequired: false,
                isPostcodeRequired: false,
                isCityRequired: false,
                isCountryRequired: false,
            }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'gdpr', props: {
            type: 'EmailList',
            key: 'emails',
            displayName: 'Email-Adressen',
            props: { minItems: 0 }
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'gdpr', props: {
            type: 'PhoneWithTypeList',
            key: 'phones',
            displayName: 'Telefon',
            props: { minItems: 0 }
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
            type: 'BiologicalGender',
            key: 'biologicalGender',
            displayName: 'Geschlecht',
            props: {}
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'ExtBool',
            key: 'consentcard',
            displayName: 'Consent-Card',
            props: {}
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'ExtBool',
            key: 'allowedToEat',
            displayName: 'Ess-Erlaubnis',
            props: {}
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'ExtBool',
            key: 'isMultiBirth',
            displayName: 'Mehrlinge',
            props: {}
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'HelperSetItemIdList',
            key: 'languages',
            displayName: 'Sprachen',
            props: {
                setId: cache.get('/helperSet/language'),
                minItems: 0,
            },
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'ForeignId',
            key: 'kigaId',
            displayName: 'Kindergarten',
            props: {
                collection: 'location',
                recordType: 'kiga',
                isNullable: true,
                constraints: {},
            },
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'Integer',
            key: 'weightAtBirth',
            displayName: 'Geburtsgewicht',
            props: { minimum: 1, isNullable: true },
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'Integer',
            key: 'weekOfPregnancy',
            displayName: 'Schwangerschaftswoche',
            props: { minimum: 1, isNullable: true },
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'HelperSetItemIdList',
            key: 'acquisitions',
            displayName: 'Akquise/Funktion',
            props: {
                setId: cache.get('/helperSet/acquisition'),
                minItems: 1,
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
            format: '${#}, ${#} (${#})',
            tokens: [
                '/gdpr/state/custom/lastname',
                '/gdpr/state/custom/firstname',
                '/scientific/state/custom/biologicalGender',
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
                '/gdpr/state/custom/lastname',
                '/gdpr/state/custom/firstname',
                '/scientific/state/custom/biologicalGender',
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
                '/gdpr/state/custom/lastname',
                '/gdpr/state/custom/firstname',
                '/scientific/state/custom/biologicalGender',
                '/scientific/state/custom/dateOfBirth',
            ]
        }
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-form-order`,
        payload: { id: crtId, formOrder: [
            '/sequenceNumber',
            '/onlineId',
            '/gdpr/state/custom/firstname',
            '/gdpr/state/custom/lastname',
            '/gdpr/state/custom/mothersName',
            '/gdpr/state/custom/fathersName',
            '/gdpr/state/custom/address',
            '/gdpr/state/custom/emails',
            '/gdpr/state/custom/phones',
            '/scientific/state/custom/dateOfBirth',
            '/scientific/state/custom/biologicalGender',
            '/scientific/state/custom/consentcard',
            '/scientific/state/custom/allowedToEat',
            '/scientific/state/custom/isMultiBirth',
            '/scientific/state/custom/languages',
            '/scientific/state/custom/kigaId',
            '/scientific/state/custom/weightAtBirth',
            '/scientific/state/custom/weekOfPregnancy',
            '/scientific/state/custom/acquisitions',
            '/scientific/state/testingPermissions',
            '/scientific/state/comment'
        ]}
    }, { apiKey });

    await driver.sendMessage({
        type: 'custom-record-types/set-duplicate-check-settings',
        payload: { id: crtId, fieldSettings: [
            { pointer: '/gdpr/state/custom/firstname', props: {}},
            { pointer: '/gdpr/state/custom/lastname', props: {}} ,
        ]}
    }, { apiKey });
    
    return crtId;
}
