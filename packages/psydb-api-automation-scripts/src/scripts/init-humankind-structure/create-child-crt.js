'use strict';
module.exports = async (context) => {
    var { apiKey, driver, cache, as } = context;

    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'subject',
            type: 'humankindChild',
            props: {
                label: 'Humankind Children',
                displayNameI18N: { 'de': 'Humankind Kinder' }
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
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'ForeignIdList',
            key: 'parentIds',
            displayName: 'Parents',
            displayNameI18N: { 'de': 'Eltern' },
            props: {
                collection: 'subject',
                recordType: 'humankindAdult',
                minItems: 0,
                addReferenceToTarget: true,
                readOnly: false,
                targetReferenceField: (
                    '/scientific/state/custom/knownChildrenIds'
                ),
                constraints: {},
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
                enableUnknownValue: false,
                enableOtherValue: true,
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
            key: 'nativeLanguageId',
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
            key: 'otherLanguageIds',
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
                readOnly: false,
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
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'ExtBool',
            key: 'hasAwayTeamTestingPermissionForNextYear',
            displayName: (
                'Kiga-Consent for Next Year'
            ),
            displayNameI18N: { 'de': (
                'Kiga-Erlaubnis im Folgejahr'
            )},
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
            '/scientific/state/custom/dateOfBirth',
            '/scientific/state/custom/gender',
            '/scientific/state/custom/siblingCount',
            '/scientific/state/custom/parentIds',
            '/scientific/state/custom/nativeLanguageId',
            '/scientific/state/custom/otherLanguageIds',
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
