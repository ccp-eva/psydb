'use strict';
module.exports = async (context) => {
    var { apiKey, driver, cache, as } = context;

    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'study',
            type: 'humankindStudy',
            props: {
                label: 'Humankind Studies',
                displayNameI18N: { 'de': 'Humankind-Studien' }
            }
        },
    }, { apiKey });

    var crtId = cache.addId({ collection: 'customRecordType', as });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
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
        }},
    }, { apiKey });
    
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'FullText',
            key: 'description',
            displayName: 'Description',
            displayNameI18N: { 'de': 'Beschreibung' },
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
                '/state/name',
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
            label: 'Humankind Studies',
            displayNameI18N: { 'de': 'Humankind-Studien' },
            enableSubjectSelectionSettings: true,
            enableLabTeams: true,
        }
    }, { apiKey });

    return crtId;
}
