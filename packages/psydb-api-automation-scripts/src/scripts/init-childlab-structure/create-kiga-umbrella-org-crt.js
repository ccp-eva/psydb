'use strict';
module.exports = async ({ apiKey, driver, cache, as }) => {
    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'externalOrganization',
            type: 'kigaUmbrellaOrg',
            props: { label: 'Träger' }
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
            type: 'SaneString',
            key: 'shorthand',
            displayName: 'Kürzel',
            props: { minLength: 0 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'contactPerson',
            displayName: 'Ansprechpartner:in',
            props: { minLength: 0 }
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

    return crtId;
}
