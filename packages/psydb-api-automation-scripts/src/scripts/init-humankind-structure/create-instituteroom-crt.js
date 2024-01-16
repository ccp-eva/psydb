'use strict';
module.exports = async (context) => {
    var { apiKey, driver, cache, as } = context;

    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'location',
            type: 'instituteroom',
            props: {
                label: 'Institute Rooms',
                displayNameI18N: { 'de': 'Instituts-Räume' }
            }
        },
    }, { apiKey });

    var crtId = cache.addId({ collection: 'customRecordType', as });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'name',
            displayName: 'Room Name',
            displayNameI18N: { 'de': 'Raumbezeichnung' },
            props: { minLength: 1 }
        }},
    }, { apiKey });
 
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'number',
            displayName: 'Room Number',
            displayNameI18N: { 'de': 'Raumnummer' },
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
            format: '${#} (${#})',
            tokens: [
                '/state/custom/name',
                '/state/custom/number',
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
                '/state/custom/name',
                '/state/custom/number',
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
                '/state/custom/name',
                '/state/custom/number',
            ]
        }
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-general-data`,
        payload: {
            id: crtId,
            reservationType: 'inhouse',
            label: 'Institute Rooms',
            displayNameI18N: { 'de': 'Instituts-Räume' }
        }
    }, { apiKey });

    return crtId;
}
