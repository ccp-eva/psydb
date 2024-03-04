'use strict';
module.exports = async (context) => {
    var { apiKey, driver, cache, as } = context;

    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'study',
            type: 'wkprc_study',
            props: { label: 'WKPRC-Study' }
        },
    }, { apiKey });

    var crtId = cache.addId({ collection: 'customRecordType', as });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'ForeignIdList',
            key: 'experimenterIds',
            displayName: 'Experimenter',
            props: {
                minItems: 0,
                collection: 'personnel',
                constraints: {},
                displayEmptyAsUnknown: false,
                addReferenceToTarget: false,
                readOnly: false,
            }
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'ForeignIdList',
            key: 'herlperPersonIds',
            displayName: 'Helfer',
            props: {
                minItems: 0,
                collection: 'personnel',
                constraints: {},
                displayEmptyAsUnknown: false,
                addReferenceToTarget: false,
                readOnly: false,
            }
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'URLStringList',
            key: 'equipmentLinks',
            displayName: 'Links zo Fotos/Videos der Apparatur',
            props: { minItems: 0 }
        }},
    }, { apiKey });
 
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'equipmentLocation',
            displayName: 'Lagerort der Apperatur',
            props: { minLength: 0 }
        }},
    }, { apiKey });
 

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'doi',
            displayName: 'DOI',
            props: { minLength: 0 }
        }},
    }, { apiKey });
 

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'FullText',
            key: 'description',
            displayName: 'Beschreibung',
            props: { minLength: 0 }
        }},
    }, { apiKey });
 

    await driver.sendMessage({
        type: `custom-record-types/commit-settings`,
        payload: { id: crtId }
    }, { apiKey });


    await driver.sendMessage({
        type: `custom-record-types/set-record-label-definition`,
        payload: { id: crtId, props: {
            format: '${#}',
            tokens: [
                '/state/shorthand',
            ]
        }}
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-display-fields`,
        payload: {
            id: crtId,
            target: 'table',
            fieldPointers: [
                '/sequenceNumber',
                '/state/shorthand',
                '/state/scientistIds',
                '/state/runningPeriod/start',
                '/state/runningPeriod/end',
            ]
        }
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/set-display-fields`,
        payload: {
            id: crtId,
            target: 'optionlist',
            fieldPointers: [
                '/sequenceNumber',
                '/state/shorthand',
            ]
        }
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-general-data`,
        payload: {
            id: crtId,
            label: 'WKPRC-Study',
            enableLabTeams: false,
            enableSubjectSelectionSettings: false,
        }
    }, { apiKey });

    return crtId;
}
