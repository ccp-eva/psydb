'use strict';
module.exports = async ({ apiKey, driver, cache, as }) => {
    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'location',
            type: 'kiga',
            props: { label: 'Kiga' }
        },
    }, { apiKey });

    var crtId = cache.addId({ collection: 'customRecordType', as });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'name',
            displayName: 'Bezeichnung',
            props: { minLength: 1 }
        }},
    }, { apiKey });
 
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'Address',
            key: 'address',
            displayName: 'Adresse',
            props: {
                isStreetRequired: true,
                isHousenumberRequired: true,
                isAffixRequired: false,
                isPostcodeRequired: true,
                isCityRequired: true,
                isCountryRequired: true,
            }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'head',
            displayName: 'Leiter:in',
            props: { minLength: 0 }
        }},
    }, { apiKey });
 
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'vice',
            displayName: 'Stellvertreter:in',
            props: { minLength: 0 }
        }},
    }, { apiKey });
 
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'ForeignId',
            key: 'supervisorId',
            displayName: 'Betreuer:in',
            props: {
                collection: 'personnel',
                isNullable: true
            }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'PhoneWithTypeList',
            key: 'phones',
            displayName: 'Telefon',
            props: { minItems: 0 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'PhoneList',
            key: 'faxes',
            displayName: 'Fax',
            props: { minItems: 0 }
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'EmailList',
            key: 'emails',
            displayName: 'Email',
            props: { minItems: 0 }
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'ForeignId',
            key: 'kigaUmbrellaOrgId',
            displayName: 'Betreuer:in',
            props: {
                collection: 'externalOrganization',
                recordType: 'kigaUmbrellaOrg',
                isNullable: false,
            }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'roomName',
            displayName: 'Raum',
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
                '/state/custom/address',
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
                '/state/custom/address',
                '/state/custom/head',
                '/state/custom/phones',
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
                '/state/custom/address',
            ]
        }
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-general-data`,
        payload: {
            id: crtId,
            label: 'Kiga',
            reservationType: 'away-team',
        }
    }, { apiKey });

    return crtId;
}
