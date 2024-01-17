'use strict';
module.exports = async ({ apiKey, driver, cache, as }) => {
    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'externalOrganization',
            type: 'kigaUmbrellaOrg',
            props: {
                label: 'Kiga Umbrella Orgs',
                displayNameI18N: { 'de': 'Träger' }
            }
        },
    }, { apiKey });

    var crtId = cache.addId({ collection: 'customRecordType', as });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'name',
            displayName: 'name',
            displayNameI18N: { 'de': 'Bezeichnung' },
            props: { minLength: 1 }
        }},
    }, { apiKey });
 
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'shorthand',
            displayName: 'Shorthand',
            displayNameI18N: { 'de': 'Kürzel' },
            props: { minLength: 0 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'contactPerson',
            displayName: 'Contact Person',
            displayNameI18N: { 'de': 'Ansprechpartner:in' },
            props: { minLength: 0 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'Address',
            key: 'address',
            displayName: 'Address',
            displayNameI18N: { 'de': 'Adresse' },
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
            displayName: 'Phone',
            displayNameI18N: { 'de': 'Telefon' },
            props: { minItems: 0 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'PhoneList',
            key: 'faxes',
            displayName: 'Fax',
            displayNameI18N: { 'de': 'Fax' },
            props: { minItems: 0 }
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'EmailList',
            key: 'emails',
            displayName: 'E-Mail',
            displayNameI18N: { 'de': 'E-Mail' },
            props: { minItems: 0 }
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
