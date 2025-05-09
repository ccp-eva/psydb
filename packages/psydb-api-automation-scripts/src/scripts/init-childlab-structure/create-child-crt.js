'use strict';
var PointerGen = require('./pointer-gen');

module.exports = async (context) => {
    var { driver, cache, as } = context;
    
    var definitions = FieldDefinitions({ cache });
    var asPointers = PointerGen(definitions);
    
    var crt = await driver.crt.create({
        collection: 'subject', key: 'child',
        displayNames: {
            'en': 'Children',
            'de': 'Kinder'
        }
    });

    cache.addCRT(crt.meta);
    var { _id: crtId } = crt.meta;

    await crt.addManyFields({ definitions: Object.values(definitions) });
    await crt.commitFields();

    await crt.setupDisplaySettings({
        recordLabelDefinition: {
            format: '${#}, ${#} (${#})',
            tokens: asPointers([ 
                'lastname', 'firstname', 'biologicalGender'
            ])
        },
        displayFields: {
            'table': [ '/sequenceNumber', ...asPointers([
                'lastname', 'firstname',
                'biologicalGender', 'dateOfBirth'
            ])],
            'optionlist': [ '/sequenceNumber', ...asPointers([
                'lastname', 'firstname',
                'biologicalGender', 'dateOfBirth'
            ])],
        },
        formOrder: [
            '/sequenceNumber',
            '/onlineId',

            ...asPointers(Object.keys(definitions)),

            '/scientific/state/testingPermissions',
            '/scientific/state/comment',
        ]
    })
 
    await driver.sendMessage({
        type: 'custom-record-types/set-duplicate-check-settings',
        payload: { id: crtId, fieldSettings: [
            { pointer: '/gdpr/state/custom/firstname', props: {}},
            { pointer: '/gdpr/state/custom/lastname', props: {}} ,
        ]}
    });
    
    await crt.updateGeneralSettings({
        displayNames: {
            'en': 'Children',
            'de': 'Kinder'
        },
        requiresTestingPermissions: true,
        showOnlineId: true,
        showSequenceNumber: true,
        commentFieldIsSensitive: false,
    })
    
    return crtId;
}

var FieldDefinitions = ({ cache, type }) => ({
    'firstname': {
        __subChannelKey: 'gdpr',
        type: 'SaneString',
        key: 'firstname',
        displayName: 'Firstname',
        displayNameI18N: { 'de': 'Vorname' },
        props: { minLength: 1 }
    },

    'lastname': {
        __subChannelKey: 'gdpr',
        type: 'SaneString',
        key: 'lastname',
        displayName: 'Lastname',
        displayNameI18N: { 'de': 'Nachname' },
        props: { minLength: 1 }
    },
    
    'mothersName': {
        __subChannelKey: 'gdpr',
        type: 'SaneString',
        key: 'mothersName',
        displayName: 'Mother',
        displayNameI18N: { 'de': 'Mutter' },
        props: { minLength: 0 }
    },

    'fathersName': {
        __subChannelKey: 'gdpr',
        type: 'SaneString',
        key: 'fathersName',
        displayName: 'Father',
        displayNameI18N: { 'de': 'Vater' },
        props: { minLength: 0 }
    },

    'address': {
        __subChannelKey: 'gdpr',
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
    },

    'emails': {
        __subChannelKey: 'gdpr',
        type: 'EmailList',
        key: 'emails',
        displayName: 'Emails',
        displayNameI18N: { 'de': 'Email-Adressen' },
        props: { minItems: 0 }
    },


    'phones': {
        __subChannelKey: 'gdpr',
        type: 'PhoneWithTypeList',
        key: 'phones',
        displayName: 'Phones',
        displayNameI18N: { 'de': 'Telefon' },
        props: { minItems: 0 }
    },

    //////////////////////////////////////////////

    'dateOfBirth': {
        __subChannelKey: 'scientific',
        type: 'DateOnlyServerSide',
        key: 'dateOfBirth',
        displayName: 'Date of Birth',
        displayNameI18N: { 'de': 'Geburtsdatum' },
        props: { isNullable: false, isSpecialAgeFrameField: true }
    },

    'biologicalGender': {
        __subChannelKey: 'scientific',
        type: 'BiologicalGender',
        key: 'biologicalGender',
        displayName: 'Gender',
        displayNameI18N: { 'de': 'Geschlecht' },
        props: {
            enableUnknownValue: true,
            enableOtherValue: false,
        }
    },
   
    'consentcard': {
        __subChannelKey: 'scientific',
        type: 'ExtBool',
        key: 'consentcard',
        displayName: 'Consent-Card',
        displayNameI18N: { 'de': 'Consent-Card' },
        props: {}
    },

    'allowedToEat': {
        __subChannelKey: 'scientific',
        type: 'ExtBool',
        key: 'allowedToEat',
        displayName: 'Allowed to Eat',
        displayNameI18N: { 'de': 'Ess-Erlaubnis' },
        props: {}
    },
   
    'isMultiBirth': {
        __subChannelKey: 'scientific',
        type: 'ExtBool',
        key: 'isMultiBirth',
        displayName: 'Multiples',
        displayNameI18N: { 'de': 'Mehrlinge' },
        props: {}
    },
   
    'languages': {
        __subChannelKey: 'scientific',
        type: 'HelperSetItemIdList',
        key: 'languages',
        displayName: 'Languages',
        displayNameI18N: { 'de': 'Sprachen' },
        props: {
            setId: cache.get('/helperSet/language'),
            minItems: 0,
        },
    },
    
    'kigaId': {
        __subChannelKey: 'scientific',
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
    },

    'weightAtBirth': {
        __subChannelKey: 'scientific',
        type: 'Integer',
        key: 'weightAtBirth',
        displayName: 'Weight at Birth',
        displayNameI18N: { 'de': 'Geburtsgewicht' },
        props: { minimum: 1, isNullable: true },
    },
   
    'weekOfPregnancy': {
        __subChannelKey: 'scientific',
        type: 'Integer',
        key: 'weekOfPregnancy',
        displayName: 'Gestation Week',
        displayNameI18N: { 'de': 'Schwangerschaftswoche' },
        props: { minimum: 1, isNullable: true },
    },

    'acquisitions': {
        __subChannelKey: 'scientific',
        type: 'HelperSetItemIdList',
        key: 'acquisitions',
        displayName: 'Acquisition/Function',
        displayNameI18N: { 'de': 'Akquise/Funktion' },
        props: {
            setId: cache.get('/helperSet/acquisition'),
            minItems: 1,
        },
    }
})
