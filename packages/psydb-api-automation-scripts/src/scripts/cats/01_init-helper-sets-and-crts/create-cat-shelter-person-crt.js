'use strict';
var { PointerGen } = require('../../../utils');

module.exports = async (context) => {
    var { driver, cache, as } = context;

    var definitions = FieldDefinitions({ cache });
    var asPointers = PointerGen(definitions);

    var crt = await driver.crt.create({
        collection: 'externalPerson', key: 'catShelterPerson',
        displayNames: {
            'en': 'Cat Shelter Person',
            'de': 'Tierheim-Kontaktperson',
        }
    });

    cache.addCRT(crt.meta);
    await crt.addManyFields({ definitions: Object.values(definitions) });
    await crt.commitFields();

    await crt.setupDisplaySettings({
        recordLabelDefinition: {
            format: '${#}, ${#}',
            tokens: asPointers([ 'lastname', 'firstname' ])
        },
        displayFields: {
            'table': [ '/sequenceNumber', ...asPointers([
                'lastname', 'firstname', 'phone', 'email'
            ])],
            'optionlist': [ '/sequenceNumber', ...asPointers([
                'lastname', 'firstname'
            ])],
        },
    })

    await crt.updateGeneralSettings({
        displayNames: {
            'en': 'Cat Shelter Person',
            'de': 'Tierheim-Kontaktperson',
        },
    });

    return crt.meta._id;
}

var FieldDefinitions = ({ cache }) => ({

    'lastname': {
        type: 'SaneString',
        key: 'lastname',
        displayName: 'Lastname',
        displayNameI18N: { 'de': 'Nachname' },
        props: { minLength: 1 }
    },

    'firstname': {
        type: 'SaneString',
        key: 'firstname',
        displayName: 'Firstname',
        displayNameI18N: { 'de': 'Vorname' },
        props: { minLength: 1 }
    },

    'phone': {
        type: 'Phone',
        key: 'phone',
        displayName: 'Phone',
        displayNameI18N: { 'de': 'Telefon' },
        props: { minLength: 0 }
    },

    'email': {
        type: 'Email',
        key: 'email',
        displayName: 'E-Mail',
        displayNameI18N: { 'de': 'E-Mail' },
        props: { minLength: 0 }
    },
})
