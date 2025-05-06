'use strict';
var PointerGen = require('./pointer-gen');

module.exports = async (context) => {
    var { driver, cache, as } = context;
    
    var definitions = FieldDefinitions({ cache });
    var asPointers = PointerGen(definitions);

    var crt = await driver.crt.create({
        collection: 'location', key: 'instituteroom',
        displayNames: {
            'en': 'Institute Rooms',
            'de': 'Instituts-Räume',
        }
    });

    cache.addCRT(crt.meta);
    var { _id: crtId } = crt.meta;

    await crt.addManyFields({ definitions: Object.values(definitions) });
    await crt.commitFields();

    await crt.setupDisplaySettings({
        recordLabelDefinition: {
            format: '${#} (${#})',
            tokens: asPointers([ 'name', 'number' ])
        },
        displayFields: {
            'table': [ '/sequenceNumber', ...asPointers([
                'name', 'number'
            ])],
            'optionlist': [ '/sequenceNumber', ...asPointers([
                'name', 'number'
            ])],
        },
    })

    await crt.updateGeneralSettings({
        displayNames: {
            'en': 'Institute Rooms',
            'de': 'Instituts-Räume',
        },
        reservationType: 'inhouse',
    });

    return crtId;
}

var FieldDefinitions = ({ cache }) => ({
    'name': {
        type: 'SaneString',
        key: 'name',
        displayName: 'Room Name',
        displayNameI18N: { 'de': 'Raumbezeichnung' },
        props: { minLength: 1 }
    },

    'number': {
        type: 'SaneString',
        key: 'number',
        displayName: 'Room Number',
        displayNameI18N: { 'de': 'Raumnummer' },
        props: { minLength: 0 }
    },
})
