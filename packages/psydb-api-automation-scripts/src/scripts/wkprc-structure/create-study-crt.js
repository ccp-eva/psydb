'use strict';
var asPointers = (keys) => keys.map(it => (
    `/state/${it}`
));

module.exports = async (context) => {
    var { driver, cache, as } = context;
    var displayNames = {
        en: 'WKPRC-Study',
    };

    var definitions = FieldDefinitions({ cache });

    var crt = await driver.crt.create({
        collection: 'study', key: 'wkprc_study',
        displayNames,
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
            // NOTE: with dev_enableWKPRCPatches studies have no shorthand
            tokens: asPointers([ 'name' ])
        },
        displayFields: {
            'optionlist': [ '/sequenceNumber', ...asPointers([
                'name',
            ])]
        },
    })

    // NOTE: "/state/experimentNames" only exists with
    // dev_enableWKPRCPatches and "/state/shorthand" only without;
    // the live system has both, so we drop what the target rejects
    await sendWithOptionalPointer({
        driver, optionalPointer: '/state/experimentNames',
        pointers: [ '/sequenceNumber', ...asPointers([
            'name',
            'scientistIds',
            'runningPeriod/start',
            'runningPeriod/end',
            'experimentNames',
        ])],
        send: (fieldPointers) => driver.sendMessage({
            type: 'custom-record-types/set-display-fields',
            payload: { id: crtId, target: 'table', fieldPointers }
        })
    });

    await crt.updateGeneralSettings({
        displayNames,
        enableLabTeams: false,
        enableSubjectSelectionSettings: false,
    })

    // NOTE: after set-general-data since that modifies the form order
    await sendWithOptionalPointer({
        driver, optionalPointer: '/state/shorthand',
        pointers: [
            ...asPointers([
                'shorthand',
                'name',
                'scientistIds',
                'researchGroupIds',
                'studyTopicIds',
                'runningPeriod/start',
                'runningPeriod/end',
                'custom/experimenterIds',
                'custom/herlperPersonIds',
                'custom/equipmentLinks',
                'custom/equipmentLocation',
                'custom/doi',
                'custom/description',
            ]),
            '/sequenceNumber'
        ],
        send: (formOrder) => driver.sendMessage({
            type: 'custom-record-types/set-form-order',
            payload: { id: crtId, formOrder }
        })
    });

    return crtId;
}

var sendWithOptionalPointer = async (bag) => {
    var { pointers, optionalPointer, send } = bag;
    try {
        await send(pointers);
    }
    catch (e) {
        if (e.apiStatus !== 'InvalidFieldPointer') {
            throw e;
        }
        await send(pointers.filter(it => it !== optionalPointer));
    }
}

// NOTE: key "herlperPersonIds" (sic!) and translations as on live system
var FieldDefinitions = ({ cache, type }) => ({
    'experimenterIds': {
        type: 'ForeignIdList',
        key: 'experimenterIds',
        displayName: 'Experimenters',
        displayNameI18N: { 'de': 'Experimenter' },
        props: {
            minItems: 0,
            collection: 'personnel',
            constraints: {},
            displayEmptyAsUnknown: false,
            addReferenceToTarget: false,
            readOnly: false,
        }
    },
    'herlperPersonIds': {
        type: 'ForeignIdList',
        key: 'herlperPersonIds',
        displayName: 'Helper Staff',
        displayNameI18N: { 'de': 'Helfer' },
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
        displayNameI18N: { 'de': 'Lagerort der Apperatur' },
        props: { minLength: 0 }
    },
    'doi': {
        type: 'SaneString',
        key: 'doi', // FIXME: maybe publicationDOI ?
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
