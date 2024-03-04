'use strict';
var createLocationCRT = async ({ apiKey, driver, site }) => {
    var label = `${site.labelEN} Location`;
    var displayNameI18N = {
        de: `${site.labelDE} Location`,
    }

    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'location',
            type: `fs_${site.type}_location`,
            props: { label, displayNameI18N }
        },
    }, { apiKey });

    var crtId = driver.getCache().lastChannelIds['customRecordType'];

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'name',
            displayName: 'Name',
            displayNameI18N: { de: 'Name' },
            props: { minLength: 1 }
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
                '/state/custom/name',
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
            ]
        }
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-general-data`,
        payload: {
            id: crtId,
            label, displayNameI18N,
            reservationType: 'away-team',
        }
    }, { apiKey });

    return crtId;
}

module.exports = createLocationCRT;
