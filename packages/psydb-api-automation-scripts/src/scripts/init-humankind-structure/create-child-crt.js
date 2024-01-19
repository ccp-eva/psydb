'use strict';
module.exports = async (context) => {
    var { apiKey, driver, cache, as } = context;

    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'subject',
            type: 'humankindSubjects',
            props: {
                label: 'Humankind Subjects',
                displayNameI18N: { 'de': 'Humankind Proband:innen' }
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
            type: 'ListOfObjects',
            key: 'parents',
            displayName: 'Parents',
            displayNameI18N: { 'de': 'Eltern' },
            props: {
                minItems: 0,
                fields: [
                    {
                        type: 'BiologicalGender',
                        key: 'gender',
                        displayName: 'Gender',
                        displayNameI18N: { 'de': 'Geschlecht' },
                        props: {
                            enableUnknownValue: false
                        }
                    },
                    {
                        type: 'SaneString',
                        key: 'lastname',
                        displayName: 'Lastname',
                        displayNameI18N: { 'de': 'Nachname' },
                        props: { minLength: 1 }
                    },
                    {
                        type: 'SaneString',
                        key: 'firstname',
                        displayName: 'Firstname',
                        displayNameI18N: { 'de': 'Vorname' },
                        props: { minLength: 1 }
                    },
                    {
                        type: 'Phone',
                        key: 'phone',
                        displayName: 'Phone',
                        displayNameI18N: { 'de': 'Telefon' },
                        props: { minLength: 1 }
                    },
                    {
                        type: 'Email',
                        key: 'email',
                        displayName: 'E-Mail',
                        displayNameI18N: { 'de': 'E-Mail' },
                        props: { minLength: 1 }
                    },
                    {
                        type: 'Address',
                        key: 'address',
                        displayName: 'Address',
                        displayNameI18N: { 'de': 'Adresse' },
                        props: {
                            isStreetRequired: false,
                            isHousenumberRequired: false,
                            isAffixRequired: false,
                            isPostcodeRequired: false,
                            isCityRequired: false,
                            isCountryRequired: false,
                        }
                    }
                ]
            },
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'DateOnlyServerSide',
            key: 'dateOfBirth',
            displayName: 'Date of Birth',
            displayNameI18N: { 'de': 'Geburtsdatum' },
            props: { isNullable: false, isSpecialAgeFrameField: true }
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'BiologicalGender',
            key: 'gender',
            displayName: 'Gender',
            displayNameI18N: { 'de': 'Geschlecht' },
            props: {
                enableUnknownValue: false
            }
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'Integer',
            key: 'siblingCount',
            displayName: 'Siblings',
            displayNameI18N: { 'de': 'Geschwister' },
            props: { minimum: 0, isNullable: true },
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'HelperSetItemId',
            key: 'nativeLanguage',
            displayName: 'Native Language',
            displayNameI18N: { 'de': 'Muttersprache' },
            props: {
                setId: cache.get('/helperSet/language'),
                isNullable: true,
                displayEmptyAsUnknown: false,
            },
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'HelperSetItemIdList',
            key: 'otherLanguages',
            displayName: 'Other Languages',
            displayNameI18N: { 'de': 'Weitere Sprachen' },
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
            displayName: 'Kindergarden',
            displayNameI18N: { 'de': 'Kindergarten' },
            props: {
                collection: 'location',
                recordType: 'kiga',
                isNullable: true,
                constraints: {},
                displayEmptyAsUnknown: false,
                addReferenceToTarget: false,
            },
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
            type: 'DefaultBool',
            key: 'canParticipateInStudiesWithHealthyChildren',
            displayName: (
                'Can participate in studies with children that are healthy, born on schedule and developed age appropriatly?'
            ),
            displayNameI18N: { 'de': (
                'Kann an Studien mit gesunden, termingerecht gebohrenen und altersgerecht entwickelten Kindern teilnehmen?'
            )},
            props: {}
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'ExtBool',
            key: 'allowedToEat',
            displayName: 'Allowed to Eat',
            displayNameI18N: { 'de': 'Ess-Erlaubnis' },
            props: {}
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
                '/scientific/state/custom/gender',
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
                '/scientific/state/custom/gender',
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
                '/scientific/state/custom/gender',
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
            '/gdpr/state/custom/parents',
            '/scientific/state/custom/dateOfBirth',
            '/scientific/state/custom/gender',
            '/scientific/state/custom/siblingCount',
            '/scientific/state/custom/nativeLanguage',
            '/scientific/state/custom/otherLanguages',
            '/scientific/state/custom/kigaId',
            '/scientific/state/custom/doesDBRegistrationConsentOnPaperExist',
            '/scientific/state/custom/canParticipateInStudiesWithHealthyChildren',
            '/scientific/state/custom/allowedToEat',
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
