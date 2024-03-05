'use strict';
var createLocationCRT = async (context) => {
    var { driver, cache, as } = context;
    var label = `Ape-Location`;

    var crt = await driver.crt.create({
        // FIXME: wkprc_ape_location
        collection: 'location', key: 'wkprc_apeLocation',
        displayNames: { 'en': label }
    });

    cache.addCRT(crt.meta);
    var { _id: crtId } = crt.meta;
    
    await crt.addManyFields({ definitions: [
        {
            type: 'SaneString',
            key: 'name',
            displayName: 'Name',
            displayNameI18N: {},
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
        displayNames: { en: label },
        reservationType: 'away-team',
    })

    return crtId;
}

module.exports = createLocationCRT;
