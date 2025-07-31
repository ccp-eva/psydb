'use strict';
var { PointerGen } = require('../../../utils');

module.exports = async (context) => {
    var { driver, cache } = context;

    var definitions = FieldDefinitions({ cache });
    var asPointers = PointerGen(definitions);

    var displayNames = {
        'en': 'Uganda Villages',
        'de': 'Uganda Dörfer',
    }

    var crt = await driver.crt.create({
        collection: 'location', key: 'fs_uganda_village',
        displayNames,
    });

    cache.addCRT(crt.meta);

    await crt.addManyFields({ definitions: Object.values(definitions) });
    await crt.commitFields();

    await crt.setupDisplaySettings({
        recordLabelDefinition: {
            format: '${#}',
            tokens: asPointers([ 'name' ])
        },
        displayFields: {
            'table': [ '/sequenceNumber', ...asPointers([
                'name'
            ])],
            'optionlist': [ '/sequenceNumber', ...asPointers([
                'name'
            ])],
        },
    })

    await crt.updateGeneralSettings({
        displayNames,
        reservationType: 'no-reservation',
    });
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
