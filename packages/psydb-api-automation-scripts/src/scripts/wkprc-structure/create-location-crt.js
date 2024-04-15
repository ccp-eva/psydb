'use strict';
var createLocationCRT = async (context) => {
    var { driver, cache, as } = context;
    var displayNames = {
        en: 'Ape Locations',
        de: 'Affen-Locations',
    };

    var crt = await driver.crt.create({
        // FIXME: wkprc_ape_location
        collection: 'location', key: 'wkprc_apeLocation',
        displayNames,
    });

    cache.addCRT(crt.meta);
    var { _id: crtId } = crt.meta;
    
    await crt.addManyFields({ definitions: [
        {
            type: 'SaneString',
            key: 'name',
            displayName: 'Name',
            displayNameI18N: { 'de': 'Name' },
            props: { minLength: 1 }
        }
    ]});

    await crt.commitFields();

    await crt.setupDisplaySettings({
        recordLabelDefinition: {
            format: '${#}',
            tokens: [ '/state/custom/name' ]
        },
        displayFields: {
            'table': [
                '/sequenceNumber',
                '/state/custom/name',
            ],
            'optionlist': [
                '/sequenceNumber',
                '/state/custom/name',
            ]
        },
    });

    await crt.updateGeneralSettings({
        displayNames,
        reservationType: 'away-team',
    })

    return crtId;
}

module.exports = createLocationCRT;
