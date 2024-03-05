'use strict';
var asPointers = (keys) => keys.map(it => (
    `/state/${it}`
));

module.exports = async (context) => {
    var { driver, cache, as } = context;
    var label = 'WKPRC-Study';

    var definitions = FieldDefinitions({ cache });

    var crt = await driver.crt.create({
        collection: 'study', key: 'wkprc_study',
        displayNames: { 'en': label }
    });

    cache.addCRT(crt.meta);
    var { _id: crtId } = crt.meta;
 
    await crt.addManyFields({ definitions: [
        ...Object.values(definitions),
    ]});

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
        displayNames: { 'en': label },
        enableLabTeams: false,
        enableSubjectSelectionSettings: false,
    })

    return crtId;
}

var FieldDefinitions = ({ cache, type }) => ({
    'experimentIds': {
        type: 'ForeignIdList',
        key: 'experimenterIds',
        displayName: 'Experimenters',
        displayNameI18N: {
            'de': 'Experimenter:innen'
        },
        props: {
            minItems: 0,
            collection: 'personnel',
            constraints: {},
            displayEmptyAsUnknown: false,
            addReferenceToTarget: false,
            readOnly: false,
        }
    },
    'helperPersonIds': {
        type: 'ForeignIdList',
        key: 'helperPersonIds', // XXX: was 'herlper....'
        displayName: 'Helpers',
        displayNameI18N: {
            'de': 'Helfer:innen'
        },
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
        displayNameI18N: {
            'de': 'Links zo Fotos/Videos der Apparatur',
        },
        props: { minItems: 0 }
    },
    'equipmentLocation': {
        type: 'SaneString',
        key: 'equipmentLocation',
        displayName: 'Storage Location of the Apparatus',
        displayNameI18N: {
            'de': 'Lagerort der Apparatur'
        },
        props: { minLength: 0 }
    },
    'doi': {
        type: 'SaneString',
        key: 'doi', // FIXME: maybe publicationDOI ?
        displayName: 'DOI',
        displayNameI18N: {
            'de': 'DOI'
        },
        props: { minLength: 0 }
    },
    'description': {
        type: 'FullText',
        key: 'description',
        displayName: 'Description',
        displayNameI18N: {
            'de': 'Beschreibung'
        },
        props: { minLength: 0 }
    }
})
