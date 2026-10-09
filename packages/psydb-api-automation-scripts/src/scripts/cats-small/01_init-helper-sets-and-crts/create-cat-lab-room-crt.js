'use strict';
var { PointerGen } = require('../../../utils');

module.exports = async (context) => {
    var { driver, cache } = context;

    var definitions = FieldDefinitions({ cache });
    var asPointers = PointerGen(definitions);

    var crt = await driver.crt.create({
        collection: 'location', key: 'catLabRoom',
        displayNames: {
            'en': 'Cat-Lab Rooms',
            'de': 'Cat-Lab Räume',
        }
    });

    cache.addCRT(crt.meta);
    var { _id: crtId } = crt.meta;

    await crt.addManyFields({ definitions: Object.values(definitions) });
    await crt.commitFields();

    await crt.setupDisplaySettings({
        recordLabelDefinition: {
            format: '${#} (${#})',
            tokens: [ ...asPointers([ 'name' ]), '/sequenceNumber' ]
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

    await crt.updateGeneralSettings({
        displayNames: {
            'en': 'Cat-Lab Rooms',
            'de': 'Cat-Lab Räume',
        },
        reservationType: 'inhouse',
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
})
