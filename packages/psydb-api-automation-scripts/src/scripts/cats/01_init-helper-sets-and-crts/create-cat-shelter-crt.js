'use strict';
var { PointerGen } = require('../../../utils');

module.exports = async (context) => {
    var { driver, cache } = context;

    var definitions = FieldDefinitions({ cache });
    var asPointers = PointerGen(definitions);

    var crt = await driver.crt.create({
        collection: 'location', key: 'catShelter',
        displayNames: {
            'en': 'Cat Shelters',
            'de': 'Tierheime',
        }
    });

    cache.addCRT(crt.meta);
    var { _id: crtId } = crt.meta;

    await crt.addManyFields({ definitions: Object.values(definitions) });
    await crt.commitFields();

    await crt.setupDisplaySettings({
        recordLabelDefinition: {
            format: '${#}',
            tokens: asPointers([ 'address' ])
        },
        displayFields: {
            'table': [ '/sequenceNumber', ...asPointers([
                'name', 'address', 'head', 'phones',
            ])],
            'optionlist': [ '/sequenceNumber', ...asPointers([
                'address'
            ])],
        },
    })

    await crt.updateGeneralSettings({
        displayNames: {
            'en': 'Kindergardens',
            'de': 'Kindergärten',
        },
        reservationType: 'away-team',
    });

    return crtId;
}

var FieldDefinitions = ({ cache }) => ({
    'name': {
        type: 'SaneString',
        key: 'name',
        displayName: 'Name',
        displayNameI18N: { 'de': 'Bezeichnung' },
        props: { minLength: 1 }
    },

    'address': {
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
    },

    'head': {
        type: 'SaneString',
        key: 'head',
        displayName: 'Head',
        displayNameI18N: { 'de': 'Leiter:in' },
        props: { minLength: 0 }
    },

    'vice': {
        type: 'SaneString',
        key: 'vice',
        displayName: 'Vice',
        displayNameI18N: { 'de': 'Stellvertreter:in' },
        props: { minLength: 0 }
    },

    'supervisorId': {
        type: 'ForeignId',
        key: 'supervisorId',
        displayName: 'Assigned RA',
        displayNameI18N: { 'de': 'Betreuer:in' },
        props: {
            collection: 'personnel',
            isNullable: true,
            constraints: {},
            displayEmptyAsUnknown: false,
            addReferenceToTarget: false,
        }
    },

    'phones': {
        type: 'PhoneWithTypeList',
        key: 'phones',
        displayName: 'Phone',
        displayNameI18N: { 'de': 'Telefon' },
        props: { minItems: 0 }
    },

    'emails': {
        type: 'EmailList',
        key: 'emails',
        displayName: 'E-Mail',
        displayNameI18N: { 'de': 'E-Mail' },
        props: { minItems: 0 }
    },
   
    'catShelterOrgId': {
        type: 'ForeignId',
        key: 'catShelterOrgId',
        displayName: 'Parent Org',
        displayNameI18N: { 'de': 'Träger' },
        props: {
            collection: 'externalOrganization',
            recordType: 'catShelterOrg',
            isNullable: true,
            constraints: {},
            displayEmptyAsUnknown: false,
            addReferenceToTarget: false,
        }
    },

    'roomInfo': {
        type: 'SaneString',
        key: 'roomInfo',
        displayName: 'Room Info',
        displayNameI18N: { 'de': 'Raum Info' },
        props: { minLength: 0 }
    },
})
