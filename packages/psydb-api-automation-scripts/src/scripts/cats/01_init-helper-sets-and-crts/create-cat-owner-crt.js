'use strict';
var { PointerGen } = require('../../../utils');

module.exports = async (context) => {
    var { driver, cache, as } = context;
    
    var definitions = FieldDefinitions({ cache });
    var asPointers = PointerGen(definitions);

    var crt = await driver.crt.create({
        collection: 'subject', key: 'catOwner',
        displayNames: {
            'en': 'Cat Owners',
            'de': 'Katzenbesitzer:innen',
        }
    });
    
    cache.addCRT(crt.meta);
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
    
    await crt.updateGeneralSettings({
        displayNames: {
            'en': 'Cat Owners',
            'de': 'Katzenbesitzer:innen',
        },
        requiresTestingPermissions: true,
        showOnlineId: true,
        showSequenceNumber: true,
        commentFieldIsSensitive: false,
    });

    return crt.meta._id;
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
        type: 'PhoneWithTypeList',
        key: 'phones',
        displayName: 'Phone',
        displayNameI18N: { 'de': 'Telefon' },
        props: {
            minItems: 0
        }
    },

    'emails': {
        __subChannelKey: 'gdpr',
        type: 'EmailList',
        key: 'emails',
        displayName: 'E-Mails',
        displayNameI18N: { 'de': 'E-Mails' },
        props: { minItems: 0 }
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
        props: {}
    },

    'acquisitionId': {
        __subChannelKey: 'scientific',
        type: 'HelperSetItemId',
        key: 'acquisitionId',
        displayName: 'Acquisition',
        displayNameI18N: { 'de': 'Akquise' },
        props: {
            setId: cache.get('/helperSet/catOwner_acquisition'),
            isNullable: true,
            displayEmptyAsUnknown: false,
        },
    },

    'knownCatIds': {
        __subChannelKey: 'scientific',
        type: 'ForeignIdList',
        key: 'knownCatIds',
        displayName: 'Cats',
        displayNameI18N: { de: 'Katzen' },
        props: {
            collection: 'subject',
            recordType: 'cat',
            minItems: 0,
            readOnly: true,
            constraints: {},
        },
    },
})
