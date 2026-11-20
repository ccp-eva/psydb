'use strict';
var createLocationCRT = async (context) => {
    var { driver, cache, as } = context;
    var displayNames = {
        en: 'Ape-Location',
    };

    var crt = await driver.crt.create({
        collection: 'location', key: 'wkprc_ape_location',
        displayNames,
    });

    cache.addCRT(crt.meta);
    var { _id: crtId } = crt.meta;

    await crt.addManyFields({ definitions: [
        {
            type: 'SaneString',
            key: 'name',
            displayName: 'Name',
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
        formOrder: [
            '/state/comment',
            '/state/custom/name',
        ]
    });

    await crt.updateGeneralSettings({
        displayNames,
        reservationType: 'no-reservation',
    })

    return crtId;
}

module.exports = createLocationCRT;
