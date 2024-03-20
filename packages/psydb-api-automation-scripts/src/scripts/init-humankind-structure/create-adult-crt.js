'use strict';
module.exports = async (context) => {
    var { apiKey, driver, cache, as } = context;

    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'subject',
            type: 'humankindAdult',
            props: {
                label: 'Humankind Adults',
                displayNameI18N: { 'de': 'Humankind Erwachsene' }
            }
        },
    }, { apiKey });

    var crtId = cache.addId({ collection: 'customRecordType', as });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'gdpr', props: {
            type: 'SaneString',
            key: 'lastname',
            displayName: 'Lastname',
            displayNameI18N: { 'de': 'Nachname' },
            props: { minLength: 1 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'gdpr', props: {
            type: 'SaneString',
            key: 'firstname',
            displayName: 'Firstname',
            displayNameI18N: { 'de': 'Vorname' },
            props: { minLength: 1 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'gdpr', props: {
            type: 'PhoneList',
            key: 'phones',
            displayName: 'Phone',
            displayNameI18N: { 'de': 'Telefon' },
            props: { minItems: 1 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'gdpr', props: {
            type: 'Email',
            key: 'email',
            displayName: 'E-Mail',
            displayNameI18N: { 'de': 'E-Mail' },
            props: { minLength: 1 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'gdpr', props: {
            type: 'Address',
            key: 'address',
            displayName: 'Address',
            displayNameI18N: { 'de': 'Adresse' },
            props: {
                isStreetRequired: true,
                isHousenumberRequired: true,
                isAffixRequired: false,
                isPostcodeRequired: true,
                isCityRequired: true,
                isCountryRequired: true,
            }
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'gdpr', props: {
            type: 'DateOnlyServerSide',
            key: 'dateOfBirth',
            displayName: 'Date of Birth',
            displayNameI18N: { 'de': 'Geburtsdatum' },
            props: { isNullable: false, isSpecialAgeFrameField: true }
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'gdpr', props: {
            type: 'BiologicalGender',
            key: 'gender',
            displayName: 'Gender',
            displayNameI18N: { 'de': 'Geschlecht' },
            props: {
                enableUnknownValue: false,
                enableOtherValue: true,
            }
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'DefaultBool',
            key: 'doesDBRegistrationConsentOnPaperExist',
            displayName: (
                'DB-Consent (Paper)'
            ),
            displayNameI18N: { 'de': (
                'DB-Einverständnis (Papier)'
            )},
            //displayName: (
            //    'DB-Registration consent exists on paper?'
            //),
            //displayNameI18N: { 'de': (
            //    'Einverständnis für DB-Registrierung in Papierform vorhanden?'
            //)},
            props: {}
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'HelperSetItemId',
            key: 'acquisitionId',
            displayName: 'Acquisition',
            displayNameI18N: { 'de': 'Akquise' },
            props: {
                setId: cache.get('/helperSet/acquisition'),
                isNullable: true,
                displayEmptyAsUnknown: false,
            },
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'ForeignIdList',
            key: 'knownChildrenIds',
            displayName: 'Children',
            displayNameI18N: { de: 'Kinder' },
            props: {
                collection: 'subject',
                recordType: `humankindChild`,
                minItems: 0,
                readOnly: true,
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
            format: '${#}, ${#} (${#})',
            tokens: [
                '/gdpr/state/custom/lastname',
                '/gdpr/state/custom/firstname',
                '/gdpr/state/custom/gender',
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
                '/gdpr/state/custom/gender',
                '/gdpr/state/custom/dateOfBirth',
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
                '/gdpr/state/custom/gender',
                '/gdpr/state/custom/dateOfBirth',
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
            '/gdpr/state/custom/phones',
            '/gdpr/state/custom/email',
            '/gdpr/state/custom/address',
            '/gdpr/state/custom/dateOfBirth',
            '/gdpr/state/custom/gender',
            '/scientific/state/custom/doesDBRegistrationConsentOnPaperExist',
            '/scientific/state/custom/acquisitionId',
            '/scientific/state/custom/knownChildrenIds',
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
