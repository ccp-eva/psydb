'use strict';
var PointerGen = require('./pointer-gen');

module.exports = async (context) => {
    var { driver, cache, as } = context;
    
    var definitions = FieldDefinitions({ cache });
    var asPointers = PointerGen(definitions);

    var crt = await driver.crt.create({
        collection: 'subject', key: 'humankindAdult',
        displayNames: {
            'en': 'Humankind Adults',
            'de': 'Humankind Erwachsene',
        }
    });

    cache.addCRT(crt.meta);
    var { _id: crtId } = crt.meta;

    await crt.addManyFields({ definitions: Object.values(definitions) });
    await crt.commitFields();

    await crt.setupDisplaySettings({
        recordLabelDefinition: {
            format: '${#}, ${#} (${#})',
            tokens: asPointers([ 'lastname', 'firstname', 'gender' ])
        },
        displayFields: {
            'table': [ '/sequenceNumber', ...asPointers([
                'lastname', 'firstname', 'gender', 'dateOfBirth'
            ])],
            'optionlist': [ '/sequenceNumber', ...asPointers([
                'lastname', 'firstname', 'gender', 'dateOfBirth'
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
    });

    return crtId;
}

var FieldDefinitions = ({ cache }) => ({

    'lastname': {
        __subChannelKey: 'gdpr',
        type: 'SaneString',
        key: 'lastname',
        displayName: 'Lastname',
        displayNameI18N: { 'de': 'Nachname' },
        props: { minLength: 1 }
    },

    'firstname': {
        __subChannelKey: 'gdpr',
        type: 'SaneString',
        key: 'firstname',
        displayName: 'Firstname',
        displayNameI18N: { 'de': 'Vorname' },
        props: { minLength: 1 }
    },



    'phones': {
        __subChannelKey: 'gdpr',
        type: 'PhoneList',
        key: 'phones',
        displayName: 'Phone',
        displayNameI18N: { 'de': 'Telefon' },
        props: { minItems: 1 }
    },

    'email': {
        __subChannelKey: 'gdpr',
        type: 'Email',
        key: 'email',
        displayName: 'E-Mail',
        displayNameI18N: { 'de': 'E-Mail' },
        props: { minLength: 1 }
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
   
    'dateOfBirth': {
        __subChannelKey: 'gdpr',
        type: 'DateOnlyServerSide',
        key: 'dateOfBirth',
        displayName: 'Date of Birth',
        displayNameI18N: { 'de': 'Geburtsdatum' },
        props: { isNullable: false, isSpecialAgeFrameField: true }
    },
   
    'gender': {
        __subChannelKey: 'gdpr',
        type: 'BiologicalGender',
        key: 'gender',
        displayName: 'Gender',
        displayNameI18N: { 'de': 'Geschlecht' },
        props: {
            enableUnknownValue: false,
            enableOtherValue: true,
        }
    },
   
    /////////////////////////////////////////////////////////////////

    'doesDBRegistrationConsentOnPaperExist': {
        __subChannelKey: 'scientific',
        type: 'DefaultBool',
        key: 'doesDBRegistrationConsentOnPaperExist',
        displayName: 'DB-Consent (Paper)',
        displayNameI18N: { 'de': 'DB-Einverständnis (Papier)' },
        //displayName: (
        //    'DB-Registration consent exists on paper?'
        //),
        //displayNameI18N: { 'de': (
        //    'Einverständnis für DB-Registrierung in Papierform vorhanden?'
        //)},
        props: {}
    },

    'acquisitionId': {
        __subChannelKey: 'scientific',
        type: 'HelperSetItemId',
        key: 'acquisitionId',
        displayName: 'Acquisition',
        displayNameI18N: { 'de': 'Akquise' },
        props: {
            setId: cache.get('/helperSet/acquisition'),
            isNullable: true,
            displayEmptyAsUnknown: false,
        },
    },

    'knownChildrenIds': {
        __subChannelKey: 'scientific',
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
    },
})

