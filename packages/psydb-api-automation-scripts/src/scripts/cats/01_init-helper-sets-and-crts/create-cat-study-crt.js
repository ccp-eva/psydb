'use strict';
var { PointerGen } = require('../../../utils');

module.exports = async (context) => {
    var { driver, cache, as } = context;
    
    var displayNames = {
        en: 'Cat Studies',
        de: 'Katzen-Studien',
    };

    var definitions = FieldDefinitions({ cache });
    var asPointers = PointerGen(definitions);

    var crt = await driver.crt.create({
        collection: 'study', key: 'catStudy',
        displayNames,
    });

    cache.addCRT(crt.meta);
    var { _id: crtId } = crt.meta;
 
    await crt.addManyFields({ definitions: Object.values(definitions) });
    await crt.commitFields();

    await crt.setupDisplaySettings({
        recordLabelDefinition: {
            format: '${#}',
            tokens: asPointers([ 'shorthand' ])
        },
        displayFields: {
            'table': [ '/sequenceNumber', ...asPointers([
                'shorthand',
                'scientistIds',
                'runningPeriod/start',
                'runningPeriod/end',
            ])],
            'optionlist': [ '/sequenceNumber', ...asPointers([
                'shorthand',
            ])]
        },
    })

    await crt.updateGeneralSettings({
        displayNames,
        enableLabTeams: true,
        enableSubjectSelectionSettings: true,
    })

    return crtId;
}

var FieldDefinitions = ({ cache, type }) => ({
    'experimenterIds': {
        type: 'ForeignIdList',
        key: 'experimenterIds',
        displayName: 'Experimenters',
        displayNameI18N: { 'de': 'Experimenter:innen' },
        props: {
            minItems: 0,
            collection: 'personnel',
            constraints: {},
            displayEmptyAsUnknown: false,
            addReferenceToTarget: false,
            readOnly: false,
        }
    },
    'helperStaffIds': {
        type: 'ForeignIdList',
        key: 'helperStaffIds',
        displayName: 'Helper Staff',
        displayNameI18N: { 'de': 'Helfer:innen' },
        props: {
            minItems: 0,
            collection: 'personnel',
            constraints: {},
            displayEmptyAsUnknown: false,
            addReferenceToTarget: false,
            readOnly: false,
        }
    },
    'equipmentLinks': {
        type: 'URLStringList',
        key: 'equipmentLinks',
        displayName: 'Links to Pictures/Videos of the Apparatus',
        displayNameI18N: { 'de': 'Links zo Fotos/Videos der Apparatur' },
        props: { minItems: 0 }
    },
    'equipmentLocation': {
        type: 'SaneString',
        key: 'equipmentLocation',
        displayName: 'Storage Location of the Apparatus',
        displayNameI18N: { 'de': 'Lagerort der Apparatur' },
        props: { minLength: 0 }
    },
    'doi': {
        type: 'SaneString',
        key: 'publicationDOI',
        displayName: 'DOI',
        displayNameI18N: { 'de': 'DOI' },
        props: { minLength: 0 }
    },
    'description': {
        type: 'FullText',
        key: 'description',
        displayName: 'Description',
        displayNameI18N: { 'de': 'Beschreibung' },
        props: { minLength: 0 }
    }
})
