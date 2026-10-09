'use strict';
var { PointerGen } = require('../../../utils');

module.exports = async (context) => {
    var { driver, cache, as } = context;
    
    var definitions = FieldDefinitions({ cache });
    var asPointers = PointerGen(definitions);

    var crt = await driver.crt.create({
        collection: 'subject', key: 'catTrainer',
        displayNames: {
            'en': 'Cat Trainer',
            'de': 'Katzentrainer:in',
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

            ...asPointers(Object.keys(definitions)),

            '/scientific/state/comment',
        ]
    })
    
    await crt.updateGeneralSettings({
        displayNames: {
            'en': 'Cat Trainer',
            'de': 'Katzentrainer:in',
        },
        requiresTestingPermissions: false,
        showOnlineId: false,
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

    'dateOfBirth': {
        __subChannelKey: 'gdpr',
        type: 'DateOnlyServerSide',
        key: 'dateOfBirth',
        displayName: 'Date of Birth',
        displayNameI18N: { 'de': 'Geburtsdatum' },
        props: { isNullable: false, isSpecialAgeFrameField: false }
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

    'phone': {
        __subChannelKey: 'gdpr',
        type: 'Phone',
        key: 'phone',
        displayName: 'Phone',
        displayNameI18N: { 'de': 'Telefon' },
        props: { minLength: 0 }
    },

    'email': {
        __subChannelKey: 'gdpr',
        type: 'Email',
        key: 'email',
        displayName: 'E-Mail',
        displayNameI18N: { 'de': 'E-Mail' },
        props: { minLength: 0 }
    },
})
