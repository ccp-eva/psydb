'use strict';
var PointerGen = require('./pointer-gen');

module.exports = async (context) => {
    var { driver, cache, as } = context;

    var definitions = FieldDefinitions({ cache });
    var asPointers = PointerGen(definitions);

    var crt = await driver.crt.create({
        collection: 'study', key: 'lueneluettenStudy',
        displayNames: {
            'en': 'Lueneluetten Studies',
            'de': 'Lueneluetten-Studien',
        }
    });

    cache.addCRT(crt.meta);
    var { _id: crtId } = crt.meta;

    await crt.addManyFields({ definitions: Object.values(definitions) });
    await crt.commitFields();

 
    await crt.setupDisplaySettings({
        recordLabelDefinition: {
            format: '${#}',
            tokens: [ '/state/shorthand' ]
        },
        displayFields: {
            'table': [
                '/sequenceNumber',
                '/state/shorthand',
                '/state/name',
                '/state/scientistIds',
                '/state/runningPeriod/start',
                '/state/runningPeriod/end',
            ],
            'optionlist': [
                '/sequenceNumber',
                '/state/shorthand',
            ],
        },
    })

    await crt.updateGeneralSettings({
        displayNames: {
            'en': 'Lueneluetten Studies',
            'de': 'Lueneluetten-Studien',
        },
        enableSubjectSelectionSettings: true,
        enableLabTeams: true,
    });

    return crtId;
}

var FieldDefinitions = ({ cache }) => ({
    'assistents': {
        type: 'ForeignIdList',
        key: 'assistents',
        displayName: 'RAs',
        displayNameI18N: { 'de': 'Betreuer:innen' },
        props: {
            minItems: 1,
            collection: 'personnel',
            constraints: {},
            displayEmptyAsUnknown: false,
            addReferenceToTarget: false,
            readOnly: false,
        }
    },
  
    'novels': {
        type: 'HelperSetItemIdList',
        key: 'novels',
        displayName: 'Novels',
        displayNameI18N: { 'de': 'Novels' },
        props: {
            minItems: 0,
            setId: cache.get('/helperSet/novel')
        }
    },

    'description': {
        type: 'FullText',
        key: 'description',
        displayName: 'Description',
        displayNameI18N: { 'de': 'Beschreibung' },
        props: { minLength: 0 }
    },
});
