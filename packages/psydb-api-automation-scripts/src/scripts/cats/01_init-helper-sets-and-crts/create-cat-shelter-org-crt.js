'use strict';
var { PointerGen } = require('../../../utils');

module.exports = async (context) => {
    var { driver, cache } = context;
    
    var definitions = FieldDefinitions({ cache });
    var asPointers = PointerGen(definitions);

    var crt = await driver.crt.create({
        collection: 'externalOrganization', key: 'catShelterOrg',
        displayNames: {
            'en': 'Parent Orgs',
            'de': 'Träger',
        }
    });

    cache.addCRT(crt.meta);
    var { _id: crtId } = crt.meta;

    await crt.addManyFields({ definitions: Object.values(definitions) });
    await crt.commitFields();

    await crt.setupDisplaySettings({
        recordLabelDefinition: {
            format: '${#}',
            tokens: asPointers([ 'name' ])
        },
        displayFields: {
            'table': [ '/sequenceNumber', ...asPointers([
                'name',
            ])],
            'optionlist': [ '/sequenceNumber', ...asPointers([
                'name'
            ])],
        },
    })
    
    return crtId;
}

var FieldDefinitions = ({ cache }) => ({
    'name': {
        type: 'SaneString',
        key: 'name',
        displayName: 'name',
        displayNameI18N: { 'de': 'Bezeichnung' },
        props: { minLength: 1 }
    },

    'contactPerson': {
        type: 'SaneString',
        key: 'contactPerson',
        displayName: 'Contact Person',
        displayNameI18N: { 'de': 'Ansprechpartner:in' },
        props: { minLength: 0 }
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
})
