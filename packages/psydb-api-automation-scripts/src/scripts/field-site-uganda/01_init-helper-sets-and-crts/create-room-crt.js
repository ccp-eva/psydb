'use strict';
var { PointerGen } = require('../../../utils');

module.exports = async (context) => {
    var { driver, cache, as } = context;
    
    var definitions = FieldDefinitions({ cache });
    var asPointers = PointerGen(definitions);

    var displayNames = {
        'en': 'Uganda Rooms',
        'de': 'Uganda Räume',
    }

    var crt = await driver.crt.create({
        collection: 'location', key: 'fs_uganda_room',
        displayNames,
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
            'table': [ '/sequenceNumber', ...asPointers([ 'name' ]) ],
            'optionlist': [ '/sequenceNumber', ...asPointers([ 'name' ]) ],
        },
    })

    await crt.updateGeneralSettings({
        displayNames,
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
})
